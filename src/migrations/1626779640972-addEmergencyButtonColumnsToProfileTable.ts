import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddEmergencyButtonColumnsToProfileTable1626779640972
  implements MigrationInterface {
  private tableName = 'profile';
  private newColumns = [
    new TableColumn({
      name: 'emergency_email_and_sms',
      type: 'tinyint',
      length: '1',
      isNullable: true,
    }),
    new TableColumn({
      name: 'automated_voice_call',
      type: 'tinyint',
      length: '1',
      isNullable: true,
    }),
    new TableColumn({
      name: 'location_access',
      type: 'tinyint',
      length: '1',
      isNullable: true,
    }),
    new TableColumn({
      name: 'uploaded_documents_access',
      type: 'tinyint',
      length: '1',
      isNullable: true,
    }),
    new TableColumn({
      name: 'emergency_message',
      type: 'LONGTEXT',
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
