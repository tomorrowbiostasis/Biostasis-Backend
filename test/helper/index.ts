import { getConnection } from 'typeorm';

export const clearDatabase = async (): Promise<void> => {
  const connection = getConnection();

  try {
    await connection.query(`SET FOREIGN_KEY_CHECKS = 0;`);
    for (const entity of connection.entityMetadatas) {
      if (entity.tableMetadataArgs.name !== 'file_category') {
        await connection
          .getRepository(entity.name)
          .query(`TRUNCATE table ${entity.tableMetadataArgs.name};`);
      }
    }

    await connection.query(`SET FOREIGN_KEY_CHECKS = 1;`);
  } catch (error) {
    await getConnection().query(`SET FOREIGN_KEY_CHECKS = 1;`);

    throw new Error(`ERROR: Cleaning test db: ${error}`);
  }
};
