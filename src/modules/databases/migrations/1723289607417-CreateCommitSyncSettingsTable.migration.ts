import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateCommitSyncSettingsTable1723289607417
  implements MigrationInterface
{
  name = 'CreateCommitSyncSettingsTable1723289607417';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'commit_sync_settings',
        columns: [
          {
            name: '_id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'date',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('commit_sync_settings');
  }
}
