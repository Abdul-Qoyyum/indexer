import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MYSQL, POSTGRES } from 'src/modules/libs/constants';
import { EntityManager, FindOperator, FindOptionsWhere } from 'typeorm';
import { RelationalCommitSyncSettingRepository } from '../repositories/relational-commit-sync-settings.repository';
import { CommitSyncSettingsEntity } from 'src/modules/databases/entities/commit-sync-setting.entity';

@Injectable()
export class CommitSyncSettingFactory {
  repository: RelationalCommitSyncSettingRepository;
  gitHubToken: string;
  githubRepoBaseUrl: string;
  dbType: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly relationalCommitSyncSettingRepository: RelationalCommitSyncSettingRepository,
  ) {
    this.dbType = this.configService.get<string>('DB_TYPE');
    this.setRepository();
  }

  setRepository() {
    switch (this.dbType) {
      case POSTGRES:
      case MYSQL:
        this.repository = this.relationalCommitSyncSettingRepository;
        break;
      default:
        this.repository = this.relationalCommitSyncSettingRepository;
    }
  }

  getRepository() {
    return this.repository;
  }

  async update(
    id: number | FindOperator<number>,
    data: Partial<CommitSyncSettingsEntity>,
    manager: EntityManager | null,
  ): Promise<Partial<CommitSyncSettingsEntity>> {
    return this.repository.update(id, data, manager);
  }

  findOne(
    data: FindOptionsWhere<CommitSyncSettingsEntity>,
  ): Promise<Partial<CommitSyncSettingsEntity>> {
    return this.repository.findOne(data);
  }

  async save(
    data: Partial<CommitSyncSettingsEntity>,
    manager: EntityManager | null,
  ) {
    const { repository_id } = data;
    const entity = await this.repository.findOne({
      repository_id,
    });
    if (entity) {
      data.id = entity.id;
    }
    return this.repository.save(
      data as Partial<CommitSyncSettingsEntity>,
      manager,
    );
  }
}
