import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MYSQL, POSTGRES } from 'src/modules/libs/constants';
import { EntityManager, FindOperator, FindOptionsWhere } from 'typeorm';
import { CommitRepository } from '../repositories/relational-commit-repository.repository';
import { CommitEntity } from 'src/modules/databases/entities/commit.entity';

@Injectable()
export class CommitFactory {
  repository: CommitRepository;
  gitHubToken: string;
  githubRepoBaseUrl: string;
  dbType: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly commitRepository: CommitRepository,
  ) {
    this.dbType = this.configService.get<string>('DB_TYPE');
    this.setRepository();
  }

  setRepository() {
    switch (this.dbType) {
      case POSTGRES:
      case MYSQL:
        this.repository = this.commitRepository;
        break;
      default:
        this.repository = this.commitRepository;
    }
  }

  getRepository() {
    return this.repository;
  }

  async update(
    id: number | FindOperator<number>,
    data: Partial<CommitEntity>,
    manager: EntityManager | null,
  ): Promise<Partial<CommitEntity>> {
    return this.repository.update(id, data, manager);
  }

  findOne(
    data: FindOptionsWhere<CommitEntity>,
  ): Promise<Partial<CommitEntity>> {
    return this.repository.findOne(data);
  }

  async save(data: Partial<CommitEntity>, manager: EntityManager | null) {
    const { repository_id } = data;
    const entity = await this.repository.findOne({
      repository_id,
    });
    if (entity) {
      data.id = entity.id;
    }
    return await this.repository.save(data, manager);
  }

  async bulkUpsert(
    updateData: Partial<CommitEntity[]>,
    path: string[],
    manager: EntityManager | null = null,
  ) {
    return await this.repository.bulkUpsert(updateData, path, manager);
  }

  async getTopAuthorsByCommitCount(limit: number): Promise<any[]> {
    const topAuthors = await this.repository.commitEntityResource
      .createQueryBuilder('commit')
      .select('commit.author', 'author')
      .addSelect('COUNT(commit.author)', 'commit_count')
      .addSelect('repository.name', 'repository_name')
      .leftJoin('commit.repository', 'repository')
      .groupBy('commit.author')
      .addGroupBy('repository.name')
      .orderBy('commit_count', 'DESC')
      .limit(limit)
      .getRawMany();

    return topAuthors;
  }

  async getCommitsByRepositoryName(
    repositoryName: string,
    page: number,
    pageSize: number,
  ): Promise<{
    commits: Partial<CommitEntity[]>;
    total: number;
    page: number;
  }> {
    const [commits, total] = await this.repository.commitEntityResource
      .createQueryBuilder('commit')
      .innerJoin('commit.repository', 'repository')
      .where('repository.name = :repositoryName', { repositoryName })
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return { total, page: Number(page), commits };
  }
}
