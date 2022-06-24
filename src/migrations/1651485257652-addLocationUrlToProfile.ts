import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddLocationUrlToProfile1651485257652
  implements MigrationInterface {
  private tableName = "profile";

  private column = new TableColumn({
    name: "location",
    type: "LONGTEXT",
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
