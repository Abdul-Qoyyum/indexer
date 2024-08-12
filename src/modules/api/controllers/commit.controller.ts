import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CoreController } from '../core.controller';
import { CommitService } from '../services/commit.service';

@Controller('commits')
@ApiTags('commits')
export class CommitController extends CoreController {
  constructor(private readonly commitService: CommitService) {
    super();
  }

  @ApiOperation({
    description: 'Api to get top (N) authors by commit count',
  })
  @Get('get-top-authors-by-commit-count/:limit')
  async getTopAuthorsByCommitCount(
    @Param('limit', ParseIntPipe) limit: number,
  ) {
    try {
      const response =
        await this.commitService.getTopAuthorsByCommitCount(limit);
      return this.successResponse(
        'Top Authors by commit count successfully retrieved',
        response,
      );
    } catch (error) {
      return this.errorResponse(error);
    }
  }

  @Get()
  @ApiOperation({
    description: 'Api to search commits by repository name',
  })
  @ApiQuery({ name: 'repository_name', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @Get('getCommitsByRepositoryName')
  async getCommitsByRepositoryName(
    @Query() query: { repository_name: string; page?: number; limit?: number },
  ) {
    try {
      const response =
        await this.commitService.getCommitsByRepositoryName(query);
      return this.successResponse('Commits successfully retrived', response);
    } catch (error) {
      return this.errorResponse(error);
    }
  }
}
