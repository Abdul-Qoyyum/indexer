import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RepositoryEvent } from 'src/modules/api/events/repository.event';
import { RepositoryFactory } from 'src/modules/api/factories/repository.factory';

@Injectable()
export class CommitSyncCron {
  private readonly _logger = new Logger(CommitSyncCron.name);
  private readonly threshold = 30;
  constructor(
    private readonly repositoryFactory: RepositoryFactory,
    private readonly repositoryChangeEvent: RepositoryEvent,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleCommitSync() {
    this._logger.debug('Started commits sync for repositories...');
    const totalRepositories = await this.repositoryFactory.getTotal({});
    const rounds = Math.ceil(totalRepositories / this.threshold);
    for (let i = 1; i <= rounds; i++) {
      const pointer = i;
      const offset = (pointer - 1) * this.threshold;
      const records = await this.repositoryFactory.find({
        skip: offset,
        take: this.threshold,
      });
      records.forEach(async (record) => {
        this._logger.log(`Syncing commits for ${JSON.stringify(record)}`);
        await this.repositoryChangeEvent.dispatch(record);
      });
    }
    this._logger.debug('Completed commits sync for repositories...');
  }
}
