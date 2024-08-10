import { InjectDataSource } from '@nestjs/typeorm';
import { RepositoryEntity } from 'src/modules/databases/entities/repository.entity';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { RepositoryChangeEvent } from '../events/repository.event';

@EventSubscriber()
export class RepositorySubscriber
  implements EntitySubscriberInterface<RepositoryEntity>
{
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly repositoryChangeEvent: RepositoryChangeEvent,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo(): any {
    return RepositoryEntity;
  }

  afterInsert(event: InsertEvent<RepositoryEntity>): Promise<any> | void {
    this.repositoryChangeEvent.dispatch(event.entity);
  }

  afterUpdate(event: UpdateEvent<RepositoryEntity>): Promise<any> | void {
    this.repositoryChangeEvent.dispatch(event.entity);
  }
}
