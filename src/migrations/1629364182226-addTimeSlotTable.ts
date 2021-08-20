import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class AddTimeSlotTable1629364182226 implements MigrationInterface {
  private tableName = 'time_slot';
  private foreignKeyUserId = 'FK_timeSlotToUser';

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
            name: 'user_id',
            type: 'varchar',
            length: '36',
            isNullable: true,
          },
          {
            name: 'active',
            type: 'boolean',
            default: false,
          },
          {
            name: 'from',
            type: 'datetime',
            length: '6',
            isNullable: true,
          },
          {
            name: 'to',
            type: 'datetime',
            length: '6',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'datetime',
            length: '6',
            isNullable: false,
            default: 'CURRENT_TIMESTAMP(6)',
          },
        ],
      }),
      true
    );
    await queryRunner.createIndex(
      this.tableName,
      new TableIndex({
        name: 'IDX_timeSlotUserId',
        columnNames: ['user_id'],
      })
    );
    await queryRunner.createForeignKey(
      this.tableName,
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        name: this.foreignKeyUserId,
        onDelete: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(this.tableName, this.foreignKeyUserId);
    await queryRunner.dropTable(this.tableName);
  }
}
