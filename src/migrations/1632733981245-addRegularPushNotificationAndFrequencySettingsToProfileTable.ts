import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddRegularPushNotificationAndFrequencySettingsToProfileTable1632733981245
  implements MigrationInterface
{
  private tableName = 'profile';
  private newColumns = [
    new TableColumn({
      name: 'regular_push_notification',
      type: 'tinyint',
      length: '1',
      isNullable: true,
    }),
    new TableColumn({
      name: 'frequency_of_regular_notification',
      type: 'smallint',
      isNullable: true,
      unsigned: true,
    }),
    new TableColumn({
      name: 'positive_info_period',
      type: 'smallint',
      isNullable: true,
      unsigned: true,
    }),
  ];

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns(this.tableName, this.newColumns);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns(this.tableName, this.newColumns);
  }
}
