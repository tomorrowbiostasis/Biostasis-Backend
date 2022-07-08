import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddMedicalInfoColumnsToProfileTable1626332132301
  implements MigrationInterface {
  private tableName = 'profile';
  private newColumns = [
    new TableColumn({
      name: 'primary_phisican',
      type: 'LONGTEXT',
      isNullable: true,
    }),
    new TableColumn({
      name: 'primary_phisican_address',
      type: 'LONGTEXT',
      isNullable: true,
    }),
    new TableColumn({
      name: 'serious_medical_issues',
      type: 'LONGTEXT',
      isNullable: true,
    }),
    new TableColumn({
      name: 'most_recent_diagnosis',
      type: 'LONGTEXT',
      isNullable: true,
    }),
    new TableColumn({
      name: 'last_hospital_visit',
      type: 'LONGTEXT',
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
