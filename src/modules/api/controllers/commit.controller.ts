import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CoreController } from '../core.controller';
import { CommitFactory } from '../factories/commit.factory';

@Controller('commits')
@ApiTags('commits')
export class CommitController extends CoreController {
  constructor(private readonly commitFactory: CommitFactory) {
    super();
  }

  @Get('get-top-authors-by-commit-count/:limit')
  async getTopAuthorsByCommitCount(
    @Param('limit', ParseIntPipe) limit: number,
  ) {
    try {
      const response =
        await this.commitFactory.getTopAuthorsByCommitCount(limit);
      return this.successResponse(
        'Authors by commit count successfully retrieved',
        response,
      );
    } catch (error) {
      return this.errorResponse(error);
    }
  }
}
