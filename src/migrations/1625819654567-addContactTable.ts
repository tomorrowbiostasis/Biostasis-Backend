import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class AddContactTable1625819654567 implements MigrationInterface {
  private tableName = 'contact';
  private foreignKeyUserId = 'FK_conversationToUser';

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
            name: 'email',
            type: 'varchar',
            length: '320',
            isNullable: true,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'surname',
            type: 'varchar',
            length: '100',
            isNullable: false,
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
    await queryRunner.dropForeignKey(this.tableName, this.foreignKeyUserId);
    await queryRunner.dropTable(this.tableName);
  }
}
