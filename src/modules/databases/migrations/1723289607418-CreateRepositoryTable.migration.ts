import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateRepositoryTable1723289607418 implements MigrationInterface {
  name = 'CreateRepositoryTable1723289607418';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'repositories',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'name',
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
    await queryRunner.dropTable('repositories');
  }
}
