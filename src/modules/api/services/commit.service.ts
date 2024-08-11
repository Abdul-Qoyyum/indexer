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
        url = `${payload.url}?since=${commitSyncSetting.date}&per_page=${this.perPage}`;
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

        const linkHeader = headers.link;

        hasMorePages = linkHeader && linkHeader.includes(`rel=\"next\"`);

        if (hasMorePages) {
          url = linkHeader.match(nextPagePattern)[0];
        }
      }

      await this.dataSource.transaction(async (manager) => {
        const commitSyncSetting = await this.commitSyncSettingFactory.save(
          {
            repository_id: payload.id,
            date,
          },
          manager,
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
}
