import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddTimezoneToProfile1651485422367
  implements MigrationInterface {
  private tableName = "profile";

  private column = new TableColumn({
    name: "timezone",
    type: "varchar",
    length: "200",
    isNullable: true,
    default: null,
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(this.tableName, this.column);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(this.tableName, this.column);
  }
}
