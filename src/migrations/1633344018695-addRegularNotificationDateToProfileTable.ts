import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addRegularNotificationDateToProfileTable1633344018695
  implements MigrationInterface
{
  private tableName = 'profile';
  private column = new TableColumn({
    name: 'regular_notification_time',
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
