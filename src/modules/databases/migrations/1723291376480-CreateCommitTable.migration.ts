import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateCommitTable1723291376480 implements MigrationInterface {
  name = 'CreateCommitTable1723291376480';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'commits',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'message',
            type: 'text',
          },
          {
            name: 'author',
            type: 'varchar',
          },
          {
            name: 'date',
            type: 'timestamp',
          },
          {
            name: 'url',
            type: 'varchar',
          },
          {
            name: 'repository_id',
            type: 'int',
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
      'commits',
      new TableForeignKey({
        columnNames: ['repository_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'repositories',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('commits');
  }
}
