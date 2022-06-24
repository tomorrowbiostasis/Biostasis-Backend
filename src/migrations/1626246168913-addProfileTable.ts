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
            type: 'LONGTEXT',
            isNullable: true,
          },
          {
            name: 'surname',
            type: 'LONGTEXT',
            isNullable: true,
          },
          {
            name: 'prefix',
            type: 'LONGTEXT',
            isNullable: true,
          },
          {
            name: 'phone',
            type: 'LONGTEXT',
            isNullable: true,
          },
          {
            name: 'address',
            type: 'LONGTEXT',
            isNullable: true,
          },
          {
            name: 'date_of_birth',
            type: 'LONGTEXT',
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
