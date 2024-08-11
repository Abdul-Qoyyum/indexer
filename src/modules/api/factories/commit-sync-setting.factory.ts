import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MONGODB, MYSQL, POSTGRES } from 'src/modules/libs/constants';
import { EntityManager, FindOperator, FindOptionsWhere } from 'typeorm';
import { MongoDBCommitSyncSettingRepository } from '../repositories/mongodb-commit-sync-setting.repository';
import { RelationalCommitSyncSettingRepository } from '../repositories/relational-commit-sync-settings.repository';
import { CommitSyncSettingsEntity } from 'src/modules/databases/entities/commit-sync-setting.entity';

@Injectable()
export class CommitSyncSettingFactory {
  repository:
    | MongoDBCommitSyncSettingRepository
    | RelationalCommitSyncSettingRepository;
  gitHubToken: string;
  githubRepoBaseUrl: string;
  dbType: string;
  constructor(
    private readonly mongoDBCommitSyncSettingRepository: MongoDBCommitSyncSettingRepository,
    private readonly configService: ConfigService,
    private readonly relationalCommitSyncSettingRepository: RelationalCommitSyncSettingRepository,
  ) {
    this.dbType = this.configService.get<string>('DB_TYPE');
    this.setRepository();
  }

  setRepository() {
    switch (this.dbType) {
      case MONGODB:
        this.repository = this.mongoDBCommitSyncSettingRepository;
        break;
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
    id: string | FindOperator<string>,
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
    // if (this.dbType === MONGODB) {
    //   return this.repository.upsertCommitSyncSettingsEntity(
    //     { repository_id },
    //     data,
    //   );
    // }
    const entity = await this.repository.findOne({
      repository_id,
    });
    if (entity) {
      data._id = entity._id;
    }
    return this.repository.save(
      data as Partial<CommitSyncSettingsEntity>,
      manager,
    );
  }
}
