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
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'description',
            type: 'text',
          },
          {
            name: 'url',
            type: 'varchar',
          },
          {
            name: 'language',
            type: 'varchar',
          },
          {
            name: 'forks_count',
            type: 'varchar',
          },
          {
            name: 'stargazers_count',
            type: 'varchar',
          },
          {
            name: 'open_issues_count',
            type: 'varchar',
          },
          {
            name: 'watchers_count',
            type: 'varchar',
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
