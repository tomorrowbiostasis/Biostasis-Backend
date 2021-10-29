import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddPulseBasedColumnsToProfileTable1635501555344
  implements MigrationInterface
{
  private tableName = 'profile';
  private newColumns = [
    new TableColumn({
      name: 'pulse_based_trigger_ios_health_permissions',
      type: 'tinyint',
      length: '1',
      isNullable: true,
    }),
    new TableColumn({
      name: 'pulse_based_trigger_ios_apple_watch_paired',
      type: 'tinyint',
      length: '1',
      isNullable: true,
    }),
    new TableColumn({
      name: 'pulse_based_trigger_google_fit_authenticated',
      type: 'tinyint',
      length: '1',
      isNullable: true,
    }),
    new TableColumn({
      name: 'pulse_based_trigger_connected_to_google_fit',
      type: 'tinyint',
      length: '1',
      isNullable: true,
    }),
    new TableColumn({
      name: 'pulse_based_trigger_background_modes_enabled',
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
