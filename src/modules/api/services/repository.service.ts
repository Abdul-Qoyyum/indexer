import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from 'src/modules/libs/http';
import { IndexRepositoryDto, ResetCommitSyncSettingsDto } from '../dtos';
import { RepositoryFactory } from '../factories/repository.factory';
import { EntityManager } from 'typeorm';
import { RepositoryEntity } from 'src/modules/databases/entities/repository.entity';
import { CommitSyncSettingFactory } from '../factories/commit-sync-setting.factory';

@Injectable()
export class RepositoryService {
  gitHubToken: string;
  githubRepoBaseUrl: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly repositoryFactory: RepositoryFactory,
    private readonly commitSyncSettingFactory: CommitSyncSettingFactory,
  ) {
    this.gitHubToken = this.configService.get<string>('GITHUB_TOKEN');
    this.githubRepoBaseUrl = this.configService.get<string>(
      'GITHUB_REPO_BASE_URL',
    );
  }

  async indexRepository(data: IndexRepositoryDto, manager: EntityManager) {
    const { owner, repo } = data;
    const providerUrl = `${this.githubRepoBaseUrl}/${owner}/${repo}`;
    const { data: gitHubRepository } = await this.httpService.send(
      'get',
      providerUrl,
      {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${this.gitHubToken}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
    );

    const {
      name,
      full_name,
      description,
      url,
      language,
      forks_count,
      stargazers_count,
      open_issues_count,
      watchers_count,
      created_at,
      updated_at,
    } = gitHubRepository;

    const details: Partial<RepositoryEntity> = {
      full_name,
      name,
      description,
      url,
      language,
      forks_count,
      stargazers_count,
      open_issues_count,
      watchers_count,
      created_at,
      updated_at,
    };
    return await this.repositoryFactory.save(details, manager);
  }

  async resetCommitSyncSettings(
    id: number,
    data: ResetCommitSyncSettingsDto,
    manager: EntityManager,
  ) {
    const repository = await this.repositoryFactory.findOne({
      id,
    });
    if (!repository) {
      throw new NotFoundException('Repository not found');
    }

    const { date } = data;
    const response = await this.commitSyncSettingFactory.save(
      {
        repository_id: repository.id,
        date: new Date(date).toISOString().slice(0, 19).replace('T', ' '),
      },
      manager,
    );

    if (!response) {
      throw new NotFoundException('Settings not found');
    }

    return response;
  }
}
