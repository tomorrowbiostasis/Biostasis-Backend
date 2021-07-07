import { Connection } from 'typeorm';
import { DICTIONARY } from '../../constant/dictionary.constant';
import { UserRepository } from '../../../user/repository/user.repository';

export const UserRepositoryProvider = {
  provide: DICTIONARY.USER,
  useFactory: (connection: Connection) =>
    connection.getCustomRepository(UserRepository),
  inject: [Connection],
};
