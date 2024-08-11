import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { RepositoryEntity } from 'src/modules/databases/entities/repository.entity';
import { CommitService } from '../services/commit.service';

@Injectable()
export class RepositoryChangeEvent {
  ENTITY_CHANGE_EVENT = 'repository.change.event';
  private readonly _logger = new Logger(RepositoryChangeEvent.name);
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly commitService: CommitService,
  ) {}

  dispatch(data) {
    this._logger.debug(
      `${this.ENTITY_CHANGE_EVENT} Repository change event dispatched`,
    );
    this.eventEmitter.emit(this.ENTITY_CHANGE_EVENT, data);
  }

  @OnEvent('repository.change.event', { async: true })
  async listenToChangeEvent(data: Partial<RepositoryEntity>) {
    try {
      this._logger.log(`listenToChangeEvent data: ${JSON.stringify(data)}`);
      await this.commitService.processCommitsSyncForRepository(data);
    } catch (e) {
      this._logger.error(
        `Error processing commit sync for changed ${JSON.stringify(data)}`,
      );
      this._logger.error(`Error: ${JSON.stringify(e)}`);
    }
  }
}
