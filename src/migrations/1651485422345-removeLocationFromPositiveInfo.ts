import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class RemoveLocationFromPositiveInfo1651485422345
  implements MigrationInterface
{
  private tableName = "positive_info";

  private column = new TableColumn({
    name: "location",
    type: "varchar",
    length: "200",
    isNullable: true,
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(this.tableName, this.column);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(this.tableName, this.column);
  }
}
