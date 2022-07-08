import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class RemoveAutomatedVoiceCallFromProfile1651485422365
  implements MigrationInterface
{
  private tableName = "profile";

  private column = new TableColumn({
    name: 'automated_voice_call',
    type: 'tinyint',
    length: '1',
    isNullable: true,
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(this.tableName, this.column);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(this.tableName, this.column);
  }
}
