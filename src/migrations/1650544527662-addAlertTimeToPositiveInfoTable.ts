import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddAlertTimeToPositiveInfoTable1650544527662
  implements MigrationInterface
{
  private tableName = 'positive_info';
  private column = new TableColumn({
    name: 'alert_time',
    type: 'datetime',
    isNullable: true,
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(this.tableName, this.column);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(this.tableName, this.column);
  }
}
