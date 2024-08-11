import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { CommitService } from '../services/commit.service';
import { CommitSyncSettingsEntity } from 'src/modules/databases/entities/commit-sync-setting.entity';
import { RepositoryFactory } from '../factories/repository.factory';

@Injectable()
export class CommitSyncSettingEvent {
  ENTITY_CHANGE_EVENT = 'commit_sync_settings.event';
  private readonly _logger = new Logger(CommitSyncSettingEvent.name);
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly commitService: CommitService,
    private readonly repositoryFactory: RepositoryFactory,
  ) {}

  dispatch(data) {
    this._logger.debug(
      `${this.ENTITY_CHANGE_EVENT} Commit sync settings change event dispatched`,
    );
    this.eventEmitter.emit(this.ENTITY_CHANGE_EVENT, data);
  }

  @OnEvent('commit_sync_settings.event', { async: true })
  async listenToChangeEvent(data: Partial<CommitSyncSettingsEntity>) {
    try {
      this._logger.log(`listenToChangeEvent data: ${JSON.stringify(data)}`);
      if (data.repository_id) {
        const repository = await this.repositoryFactory.findOne({
          id: data.repository_id,
        });
        if (repository) {
          this._logger.log(`repository: ${JSON.stringify(repository)}`);
          await this.commitService.processCommitsSyncForRepository(repository);
        }
      }
    } catch (e) {
      this._logger.error(
        `Error processing commit sync for changed ${JSON.stringify(data)}`,
      );
      this._logger.error(`Error: ${JSON.stringify(e)}`);
    }
  }
}
