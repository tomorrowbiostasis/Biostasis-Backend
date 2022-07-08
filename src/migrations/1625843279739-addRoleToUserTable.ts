import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddRoleToUserTable1625843279739 implements MigrationInterface {
  private tableName = 'user';
  private column = new TableColumn({
    name: 'role',
    type: 'tinyint',
    length: '1',
    isNullable: false,
    default: 0,
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(this.tableName, this.column);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(this.tableName, this.column);
  }
}
