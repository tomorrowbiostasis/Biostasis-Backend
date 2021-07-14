import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class AddProfileTable1626246168913 implements MigrationInterface {
  private tableName = 'profile';
  private foreignKeyUserId = 'FK_profileToUser';

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
            name: 'name',
            type: 'varchar',
            isNullable: true,
            length: '100',
          },
          {
            name: 'surname',
            type: 'varchar',
            isNullable: true,
            length: '100',
          },
          {
            name: 'prefix',
            type: 'varchar',
            length: '3',
            isNullable: true,
          },
          {
            name: 'phone',
            type: 'varchar',
            length: '12',
            isNullable: true,
          },
          {
            name: 'address',
            type: 'varchar',
            length: '200',
            isNullable: true,
          },
          {
            name: 'date_of_birth',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'datetime',
            length: '6',
            isNullable: false,
            default: 'CURRENT_TIMESTAMP(6)',
          },
          {
            name: 'updated_at',
            type: 'datetime',
            length: '6',
            isNullable: true,
            default: 'CURRENT_TIMESTAMP(6)',
          },
        ],
      })
    );
    await queryRunner.createIndex(
      this.tableName,
      new TableIndex({
        name: 'IDX_contactUserId',
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
    await queryRunner.dropTable(this.tableName);
  }
}
