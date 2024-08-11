import { Module } from '@nestjs/common';
import { CommitSyncCron } from './cron/commit-sync.cron';
import { ApiModule } from 'src/modules/api/api.module';

@Module({
  imports: [ApiModule],
  controllers: [],
  providers: [CommitSyncCron],
  exports: [],
})
export class CronModule {}
