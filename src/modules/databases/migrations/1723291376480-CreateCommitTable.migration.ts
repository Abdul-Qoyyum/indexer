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
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'message',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'author',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'date',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'url',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'repository_id',
            type: 'uuid',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'commits',
      new TableForeignKey({
        columnNames: ['repository_id'],
        referencedColumnNames: ['_id'],
        referencedTableName: 'repositories',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('commits');
  }
}
