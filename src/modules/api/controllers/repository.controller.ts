import {
  Body,
  Controller,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RepositoryService } from '../services/repository.service';
import { IndexRepositoryDto, ResetCommitSyncSettingsDto } from '../dtos';
import { DataSource } from 'typeorm';
import { CoreController } from '../core.controller';

@Controller('repository')
@ApiTags('repository')
export class RepositoryController extends CoreController {
  constructor(
    @Inject(DataSource) private readonly dataSource: DataSource,
    private readonly repositoryService: RepositoryService,
  ) {
    super();
  }

  @Post('index')
  async indexRepository(@Body() data: IndexRepositoryDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const response = await this.repositoryService.indexRepository(
        data,
        queryRunner.manager,
      );
      await queryRunner.commitTransaction();
      return this.successResponse('Repository queued for processing', response);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return this.errorResponse(error);
    } finally {
      await queryRunner.release();
    }
  }

  @Put('reset-commit-sync-settings/:repository')
  async resetCommitSyncSettings(
    @Param('repository', ParseIntPipe) repository: number,
    @Body() data: ResetCommitSyncSettingsDto,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const response = await this.repositoryService.resetCommitSyncSettings(
        repository,
        data,
        queryRunner.manager,
      );
      await queryRunner.commitTransaction();
      return this.successResponse(
        'Repository commits settings successfully updated',
        response,
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return this.errorResponse(error);
    } finally {
      await queryRunner.release();
    }
  }
}
