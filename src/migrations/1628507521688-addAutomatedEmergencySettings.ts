import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddAutomatedEmergencySettings1628507521688
  implements MigrationInterface
{
  private tableName = 'profile';
  private newColumns = [
    new TableColumn({
      name: 'read_manual',
      type: 'tinyint',
      length: '1',
      isNullable: true,
    }),
    new TableColumn({
      name: 'automated_emergency',
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
