import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddDeviceIdToUserTable1632482760947 implements MigrationInterface {
  private tableName = 'user';
  private column = new TableColumn({
    name: 'device_id',
    type: 'varchar',
    length: '200',
    isNullable: true,
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(this.tableName, this.column);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(this.tableName, this.column);
  }
}
