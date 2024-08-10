import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { InjectDataSource } from '@nestjs/typeorm';
import { RepositoryEntity } from 'src/modules/databases/entities/repository.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class RepositoryChangeEvent {
  ENTITY_CHANGE_EVENT = 'repository.change.event';
  private readonly _logger = new Logger(RepositoryChangeEvent.name);
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly eventEmitter: EventEmitter2,
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
      //   await this.dataSource.transaction(async (manager) => {
      //Do the processing over here
      //   });
    } catch (e) {
      this._logger.error(
        `Error processing commit sync for changed ${JSON.stringify(data)}`,
      );
    }
  }
}
