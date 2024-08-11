import { Module } from '@nestjs/common';
import { RelationalRepository } from './repositories/relational-repository.repository';
import { RepositoryService } from './services/repository.service';
import { RepositoryFactory } from './factories/repository.factory';
import { RepositoryController } from './controllers/repository.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepositoryEntity } from '../databases/entities/repository.entity';
import { CommitEntity } from '../databases/entities/commit.entity';
import { RepositoryChangeEvent } from './events/repository.event';
import { RepositorySubscriber } from './subscribers/repository.subscriber';
import { CommitService } from './services/commit.service';
import { CommitSyncSettingsEntity } from '../databases/entities/commit-sync-setting.entity';
import { CommitSyncSettingFactory } from './factories/commit-sync-setting.factory';
import { RelationalCommitSyncSettingRepository } from './repositories/relational-commit-sync-settings.repository';
import { CommitRepository } from './repositories/relational-commit-repository.repository';
import { CommitFactory } from './factories/commit.factory';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CommitEntity,
      CommitSyncSettingsEntity,
      RepositoryEntity,
      CommitRepository,
    ]),
  ],
  controllers: [RepositoryController],
  providers: [
    RepositoryService,
    RepositoryFactory,
    RepositoryChangeEvent,
    RepositorySubscriber,
    CommitService,
    RelationalRepository,
    CommitSyncSettingFactory,
    RelationalCommitSyncSettingRepository,
    CommitFactory,
    CommitRepository,
  ],
  exports: [],
})
export class ApiModule {}
