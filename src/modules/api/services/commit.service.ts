import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from 'src/modules/libs/http';

@Injectable()
export class CommitService {
  gitHubToken: string;
  githubRepoBaseUrl: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.gitHubToken = this.configService.get<string>('GITHUB_TOKEN');
    this.githubRepoBaseUrl = this.configService.get<string>(
      'GITHUB_REPO_BASE_URL',
    );
  }
}
