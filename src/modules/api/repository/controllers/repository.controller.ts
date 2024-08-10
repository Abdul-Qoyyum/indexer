import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RepositoryService } from '../services/repository.service';
import { IndexRepositoryDto } from '../dtos';
import { DataSource } from 'typeorm';
import { CoreController } from '../../core.controller';

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
}
