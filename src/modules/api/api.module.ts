import { Module } from '@nestjs/common';
import { RelationalRepository } from './repository/repositories/relational-repository.repository';
import { MongoDBRepository } from './repository/repositories/mongodb-repository.repository';
import { RepositoryService } from './repository/services/repository.service';
import { RepositoryFactory } from './repository/factories/repository.factory';
import { RepositoryController } from './repository/controllers/repository.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepositoryEntity } from '../databases/entities/repository.entity';
import { CommitEntity } from '../databases/entities/commit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RepositoryEntity, CommitEntity])],
  controllers: [RepositoryController],
  providers: [
    RepositoryService,
    RelationalRepository,
    MongoDBRepository,
    RepositoryFactory,
  ],
  exports: [],
})
export class ApiModule {}
