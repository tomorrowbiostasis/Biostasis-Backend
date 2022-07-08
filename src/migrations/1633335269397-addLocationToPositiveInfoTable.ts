import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddLocationToPositiveInfoTable1633335269397
  implements MigrationInterface {
  private tableName = 'positive_info';
  private column = new TableColumn({
    name: 'location',
    type: 'LONGTEXT',
    isNullable: true,
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(this.tableName, this.column);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(this.tableName, this.column);
  }
}
