import { Module } from '@nestjs/common';
import { RelationalRepository } from './repositories/relational-repository.repository';
import { MongoDBRepository } from './repositories/mongodb-repository.repository';
import { RepositoryService } from './services/repository.service';
import { RepositoryFactory } from './factories/repository.factory';
import { RepositoryController } from './controllers/repository.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepositoryEntity } from '../databases/entities/repository.entity';
import { CommitEntity } from '../databases/entities/commit.entity';
import { RepositoryChangeEvent } from './events/repository.event';
import { RepositorySubscriber } from './subscribers/repository.subscriber';
import { CommitService } from './services/commit.service';

@Module({
  imports: [TypeOrmModule.forFeature([RepositoryEntity, CommitEntity])],
  controllers: [RepositoryController],
  providers: [
    RepositoryService,
    RelationalRepository,
    MongoDBRepository,
    RepositoryFactory,
    RepositoryChangeEvent,
    RepositorySubscriber,
    CommitService,
  ],
  exports: [],
})
export class ApiModule {}
