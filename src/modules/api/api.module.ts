import { Module } from '@nestjs/common';
import { RelationalGithubRepository } from './repository/repositories/relational-repository.repository';
import { MongoDBGithubRepository } from './repository/repositories/mongodb-repository.repository';
import { GithubRepositoryService } from './repository/services/github-repository.service';

@Module({
  imports: [],
  controllers: [],
  providers: [
    GithubRepositoryService,
    RelationalGithubRepository,
    MongoDBGithubRepository,
  ],
})
export class ApiModule {}
