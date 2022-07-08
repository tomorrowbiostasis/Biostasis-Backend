import { Connection } from 'typeorm';
import { FileCategoryRepository } from '../repository/file-category.repository';

export const FileCategoryRepositoryProvider = {
  provide: FileCategoryRepository,
  useFactory: (connection: Connection) =>
    connection.getCustomRepository(FileCategoryRepository),
  inject: [Connection],
};
