import { Injectable, NotFoundException } from '@nestjs/common';
import {
  EntityManager,
  FindOperator,
  FindOptionsWhere,
  MongoRepository,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CommitSyncSettingInterface } from '../interfaces';
import { CommitSyncSettingsEntity } from 'src/modules/databases/entities/commit-sync-setting.entity';

@Injectable()
export class MongoDBCommitSyncSettingRepository
  implements CommitSyncSettingInterface
{
  constructor(
    @InjectRepository(CommitSyncSettingsEntity)
    private readonly commitSyncSetting: MongoRepository<CommitSyncSettingsEntity>,
  ) {}

  async findOne(
    data: FindOptionsWhere<CommitSyncSettingsEntity>,
  ): Promise<CommitSyncSettingsEntity> {
    return await this.commitSyncSetting.findOne({ where: data });
  }

  async save(
    data: Partial<CommitSyncSettingsEntity>,
    manager: EntityManager | null,
  ): Promise<Partial<CommitSyncSettingsEntity>> {
    return manager
      ? await manager.save(CommitSyncSettingsEntity, data)
      : await this.commitSyncSetting.save(data);
  }

  async update(
    id: string | FindOperator<string>,
    data: Partial<CommitSyncSettingsEntity>,
    manager: EntityManager | null,
  ): Promise<Partial<CommitSyncSettingsEntity>> {
    const repository = await this.commitSyncSetting.findOne({
      where: { _id: id },
    });

    if (!repository) {
      throw new NotFoundException('Commit sync settings not found');
    }

    Object.assign(repository, data);

    return manager
      ? await manager.save(repository)
      : await this.commitSyncSetting.save(repository);
  }

  async delete(id: string | number): Promise<void> {
    const result = await this.commitSyncSetting.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Commit sync settings not found');
    }
  }

  async upsertCommitSyncSettingsEntity(
    filter: Partial<CommitSyncSettingsEntity>,
    updateData: Partial<CommitSyncSettingsEntity>,
  ): Promise<Partial<CommitSyncSettingsEntity>> {
    const result = await this.commitSyncSetting.findOneAndUpdate(
      filter,
      { $set: updateData },
      { returnDocument: 'after', upsert: true },
    );
    return result.value;
  }
}
