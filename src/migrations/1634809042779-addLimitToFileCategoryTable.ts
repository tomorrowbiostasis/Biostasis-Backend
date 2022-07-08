import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddLimitToFileCategoryTable1634809042779
  implements MigrationInterface
{
  private tableName = 'file_category';
  private column = new TableColumn({
    name: 'limit',
    type: 'tinyint',
    default: 0,
    unsigned: true,
  });
  private categories = [
    {
      code: 'medicalDirective',
      limit: 1,
    },
    {
      code: 'lastWill',
      limit: 1,
    },
    {
      code: 'other',
      limit: 5,
    },
  ];

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(this.tableName, this.column);

    for (const category of this.categories) {
      await queryRunner.query(
        `UPDATE \`${this.tableName}\` SET \`limit\` = ? WHERE code = ?`,
        [category.limit, category.code]
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(this.tableName, this.column);
  }
}
