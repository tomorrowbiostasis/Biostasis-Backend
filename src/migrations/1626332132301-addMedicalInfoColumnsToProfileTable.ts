import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddMedicalInfoColumnsToProfileTable1626332132301
  implements MigrationInterface
{
  private tableName = 'profile';
  private newColumns = [
    new TableColumn({
      name: 'primary_phisican',
      type: 'varchar',
      isNullable: true,
      length: '200',
    }),
    new TableColumn({
      name: 'primary_phisican_address',
      type: 'varchar',
      isNullable: true,
      length: '200',
    }),
    new TableColumn({
      name: 'serious_medical_issues',
      type: 'tinyint',
      length: '1',
      isNullable: true,
    }),
    new TableColumn({
      name: 'most_recent_diagnosis',
      type: 'varchar',
      length: '300',
      isNullable: true,
    }),
    new TableColumn({
      name: 'last_hospital_visit',
      type: 'date',
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
