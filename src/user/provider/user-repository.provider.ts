import { Connection } from 'typeorm';
import { UserRepository } from '../repository/user.repository';

export const UserRepositoryProvider = {
  provide: UserRepository,
  useFactory: (connection: Connection) =>
    connection.getCustomRepository(UserRepository),
  inject: [Connection],
};
