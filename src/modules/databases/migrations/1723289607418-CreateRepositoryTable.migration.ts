import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateRepositoryTable1723289607418 implements MigrationInterface {
  name = 'CreateRepositoryTable1723289607418';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'repositories',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'full_name',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'url',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'language',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'forks_count',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'stargazers_count',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'open_issues_count',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'watchers_count',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'commit_sync_setting_id',
            type: 'int',
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

    await queryRunner.createForeignKey(
      'repositories',
      new TableForeignKey({
        columnNames: ['commit_sync_setting_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'commit_sync_settings',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('repositories');
  }
}
