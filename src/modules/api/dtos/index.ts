import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class IndexRepositoryDto {
  @ApiProperty({ example: 'chromium' })
  @IsString()
  owner: string;

  @ApiProperty({ example: 'chromium' })
  @IsString()
  repo: string;
}
