import { MigrationInterface, QueryRunner } from 'typeorm';

export class MinutesAsNullableInPositiveInfoTable1633500446819
  implements MigrationInterface
{
  private tableName = 'positive_info';
  private columName = 'minutes_to_next';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE ${this.tableName} MODIFY ${this.columName} smallint UNSIGNED null`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE ${this.tableName} MODIFY ${this.columName} smallint UNSIGNED not null`
    );
  }
}
