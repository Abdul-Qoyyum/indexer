import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RepositoryEntity } from 'src/modules/databases/entities/repository.entity';
import { HttpService } from 'src/modules/libs/http';
import { RepositoryFactory } from '../factories/repository.factory';
import { CommitSyncSettingFactory } from '../factories/commit-sync-setting.factory';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { CommitFactory } from '../factories/commit.factory';

@Injectable()
export class CommitService {
  gitHubToken: string;
  githubRepoBaseUrl: string;
  private readonly _logger = new Logger(CommitService.name);
  perPage: number;
  chunkSize: number;
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly repositoryFactory: RepositoryFactory,
    private readonly commitSyncSettingFactory: CommitSyncSettingFactory,
    private readonly commitFactory: CommitFactory,
  ) {
    this.gitHubToken = this.configService.get<string>('GITHUB_TOKEN');
    this.githubRepoBaseUrl = this.configService.get<string>(
      'GITHUB_REPO_BASE_URL',
    );
    this.perPage = 30;
    this.chunkSize = 500;
  }

  async processCommitsSyncForRepository(payload: Partial<RepositoryEntity>) {
    this._logger.log(
      `processCommitsSyncForRepository: ${JSON.stringify(payload)}`,
    );
    if (payload?.url) {
      let url = `${payload.url}/commits?per_page=${this.perPage}`;

      const commitSyncSetting = await payload.commit_sync_setting;

      this._logger.log(
        `commitSyncSetting: ${JSON.stringify(commitSyncSetting)}`,
      );

      if (commitSyncSetting?.date) {
        const since = new Date(commitSyncSetting.date).toISOString();
        url = `${payload.url}/commits?since=${since}&per_page=${this.perPage}`;
      }

      let date: string;
      const records = [];
      const nextPagePattern = /(?<=<)([\S]*)(?=>; rel="Next")/i;
      let hasMorePages = true;

      while (hasMorePages) {
        this._logger.log(`Url: ${url}`);

        const { data, headers } = await this.httpService.send('get', url, {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${this.gitHubToken}`,
          'X-GitHub-Api-Version': '2022-11-28',
        });

        this._logger.log(`Response Headers: ${JSON.stringify(headers)}`);

        const parsedData = this.parseData(data);

        parsedData.forEach((record) => {
          date = new Date(record?.commit?.committer?.date)
            .toISOString()
            .slice(0, 19)
            .replace('T', ' ');
          records.push({
            message: record?.commit?.message,
            author: record?.commit?.author?.name,
            date,
            url: record?.commit?.url,
            repository_id: payload.id,
            node_id: record?.node_id,
          });
        });

        // Release RAM / In memory usage
        // Insert records in batches of 500
        if (records.length >= this.chunkSize) {
          const batch = records.splice(0, this.chunkSize);
          await this.dataSource.transaction(async (manager) => {
            const commitSyncSetting = await this.commitSyncSettingFactory.save(
              {
                repository_id: payload.id,
                date,
                reset_status: false,
              },
              manager,
            );

            this._logger.log(
              `commitSyncSetting: ${JSON.stringify(commitSyncSetting)}`,
            );

            await Promise.all([
              this.repositoryFactory.save(
                {
                  id: payload.id,
                  commit_sync_setting_id: commitSyncSetting.id,
                },
                manager,
              ),
              this.commitFactory.bulkUpsert(batch, ['node_id'], manager),
            ]);
          });
        }

        // Check if there are more pages
        const linkHeader = headers.link;
        this._logger.log(`linkHeader: ${JSON.stringify(linkHeader)}`);
        hasMorePages = linkHeader && linkHeader.includes(`rel=\"next\"`);

        if (hasMorePages) {
          url = linkHeader.match(nextPagePattern)[0];
        }
      }

      // Insert remaining records if any
      if (records.length > 0) {
        await this.dataSource.transaction(async (manager) => {
          const commitSyncSetting = await this.commitSyncSettingFactory.save(
            {
              repository_id: payload.id,
              date,
              reset_status: false,
            },
            manager,
          );

          this._logger.log(
            `commitSyncSetting: ${JSON.stringify(commitSyncSetting)}`,
          );

          await Promise.all([
            this.repositoryFactory.save(
              {
                id: payload.id,
                commit_sync_setting_id: commitSyncSetting.id,
              },
              manager,
            ),
            this.commitFactory.bulkUpsert(records, ['node_id'], manager),
          ]);
        });
      }
    }
  }

  parseData(data) {
    if (Array.isArray(data)) {
      return data;
    }

    if (!data) {
      return [];
    }

    delete data.incomplete_results;
    delete data.repository_selection;
    delete data.total_count;
    const namespaceKey = Object.keys(data)[0];
    data = data[namespaceKey];

    return data;
  }

  async getTopAuthorsByCommitCount(limit: number) {
    return this.commitFactory.getTopAuthorsByCommitCount(limit);
  }

  async getCommitsByRepositoryName(query: {
    repository_name: string;
    page?: number;
    limit?: number;
  }) {
    const currentPage = query?.page ?? 1;
    const perPage = query?.limit ?? 10;
    return this.commitFactory.getCommitsByRepositoryName(
      query.repository_name,
      currentPage,
      perPage,
    );
  }
}
