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
}
