import { InjectDataSource } from '@nestjs/typeorm';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  UpdateEvent,
} from 'typeorm';
import { Logger } from '@nestjs/common';
import { CommitSyncSettingsEntity } from 'src/modules/databases/entities/commit-sync-setting.entity';
import { CommitSyncSettingEvent } from '../events/commit-sync-setting.event';

@EventSubscriber()
export class CommitSyncSettingSubscriber
  implements EntitySubscriberInterface<CommitSyncSettingsEntity>
{
  private readonly _logger = new Logger(CommitSyncSettingSubscriber.name);

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly commitSyncSettingEvent: CommitSyncSettingEvent,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo(): any {
    return CommitSyncSettingsEntity;
  }

  afterUpdate(
    event: UpdateEvent<CommitSyncSettingsEntity>,
  ): Promise<any> | void {
    if (event.entity.reset_status) {
      this._logger.log(`After Update ${JSON.stringify(event.entity)}`);
      this.commitSyncSettingEvent.dispatch(event.entity);
    }
  }
}
