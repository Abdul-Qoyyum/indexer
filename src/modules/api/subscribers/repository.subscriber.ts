import { InjectDataSource } from '@nestjs/typeorm';
import { RepositoryEntity } from 'src/modules/databases/entities/repository.entity';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { RepositoryEvent } from '../events/repository.event';
import { Logger } from '@nestjs/common';

@EventSubscriber()
export class RepositorySubscriber
  implements EntitySubscriberInterface<RepositoryEntity>
{
  private readonly _logger = new Logger(RepositorySubscriber.name);

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly repositoryChangeEvent: RepositoryEvent,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo(): any {
    return RepositoryEntity;
  }

  afterInsert(event: InsertEvent<RepositoryEntity>): Promise<any> | void {
    this._logger.log(`After Insert ${JSON.stringify(event.entity)}`);
    this.repositoryChangeEvent.dispatch(event.entity);
  }
}
