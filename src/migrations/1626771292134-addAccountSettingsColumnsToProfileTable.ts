import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddAccountSettingsColumnsToProfileTable1626771292134
  implements MigrationInterface
{
  private tableName = 'profile';
  private newColumns = [
    new TableColumn({
      name: 'allow_notifications',
      type: 'tinyint',
      length: '1',
      isNullable: true,
    }),
    new TableColumn({
      name: 'tips_and_tricks',
      type: 'tinyint',
      length: '1',
      isNullable: true,
    }),
  ];

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns(this.tableName, this.newColumns);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns(this.tableName, this.newColumns);
  }
}
