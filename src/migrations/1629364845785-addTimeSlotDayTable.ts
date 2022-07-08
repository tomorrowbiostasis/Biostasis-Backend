import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class AddTimeSlotDayTable1629364845785 implements MigrationInterface {
  private tableName = 'time_slot_day';
  private foreignKeyUserId = 'FK_timeSlotDayToTimeSlot';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        columns: [
          {
            name: 'id',
            type: 'int',
            isGenerated: true,
            isPrimary: true,
            generationStrategy: 'increment',
          },
          {
            name: 'time_slot_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'day_of_week',
            type: 'tinyint',
            isNullable: false,
          },
        ],
      }),
      true
    );
    await queryRunner.createIndex(
      this.tableName,
      new TableIndex({
        name: 'IDX_timeSlotDayTimeSlotId',
        columnNames: ['time_slot_id'],
      })
    );
    await queryRunner.createForeignKey(
      this.tableName,
      new TableForeignKey({
        columnNames: ['time_slot_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'time_slot',
        name: this.foreignKeyUserId,
        onDelete: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
