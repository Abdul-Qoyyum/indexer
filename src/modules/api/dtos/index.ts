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
  @ApiProperty({ example: 'chromium' })
  @IsDate()
  @Type(() => Date)
  date: Date;
}
