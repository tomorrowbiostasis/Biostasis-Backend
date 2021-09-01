import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class AddFileCategoryTableWithValues1630406730426
  implements MigrationInterface
{
  private tableName = 'file_category';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        columns: [
          {
            name: 'id',
            type: 'tinyint',
            isGenerated: true,
            isPrimary: true,
            generationStrategy: 'increment',
          },
          {
            name: 'code',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'datetime',
            length: '6',
            isNullable: false,
            default: 'CURRENT_TIMESTAMP(6)',
          },
        ],
      }),
      true
    );
    await queryRunner.query(
      `INSERT INTO \`${this.tableName}\` (\`code\`) VALUES ('medicalDirective'),('lastWill'),('other')`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.tableName);
  }
}
