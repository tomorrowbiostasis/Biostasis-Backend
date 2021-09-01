import { Connection } from 'typeorm';
import { FileRepository } from '../repository/file.repository';

export const FileRepositoryProvider = {
  provide: FileRepository,
  useFactory: (connection: Connection) =>
    connection.getCustomRepository(FileRepository),
  inject: [Connection],
};
