import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRepositoryNameIndex1723411737986 implements MigrationInterface {
  name = 'AddRepositoryNameIndex1723411737986';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX \`IDX_repository_name\` ON \`repositories\` (\`name\`)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_repository_name\` ON \`repositories\``,
    );
  }
}
