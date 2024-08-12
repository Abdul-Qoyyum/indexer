import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';

export class IndexRepositoryDto {
  @ApiProperty({ example: 'chromium' })
  @IsString()
  owner: string;

  @ApiProperty({ example: 'chromium' })
  @IsString()
  repo: string;
}

export class ResetCommitSyncSettingsDto {
  @ApiProperty({ example: '2020-04-07 13:08:38' })
  @IsDate()
  @Type(() => Date)
  date: Date;
}
