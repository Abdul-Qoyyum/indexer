import { CommitSyncSettingsEntity } from 'src/modules/databases/entities/commit-sync-setting.entity';
import { EntityManager, FindOperator, FindOptionsWhere } from 'typeorm';

export interface CommitSyncSettingInterface {
  findOne(
    data: FindOptionsWhere<CommitSyncSettingsEntity>,
  ): Promise<Partial<CommitSyncSettingsEntity>>;
  save(
    data: Partial<CommitSyncSettingsEntity>,
    manager: EntityManager | null,
  ): Promise<Partial<CommitSyncSettingsEntity>>;
  update(
    id: number | FindOperator<number>,
    data: Partial<CommitSyncSettingsEntity>,
    manager: EntityManager | null,
  ): Promise<Partial<CommitSyncSettingsEntity>>;
  delete(id: string | number): Promise<void>;
  upsertCommitSyncSettingsEntity(
    filter: Partial<CommitSyncSettingsEntity>,
    updateData: Partial<CommitSyncSettingsEntity>,
  );
}
