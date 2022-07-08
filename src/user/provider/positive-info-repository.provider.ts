import { Connection } from 'typeorm';
import { PositiveInfoRepository } from '../repository/positive-info.repository';

export const PositiveInfoRepositoryProvider = {
  provide: PositiveInfoRepository,
  useFactory: (connection: Connection) =>
    connection.getCustomRepository(PositiveInfoRepository),
  inject: [Connection],
};
