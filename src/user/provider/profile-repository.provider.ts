import { Connection } from 'typeorm';
import { ProfileRepository } from '../repository/profile.repository';

export const ProfileRepositoryProvider = {
  provide: ProfileRepository,
  useFactory: (connection: Connection) =>
    connection.getCustomRepository(ProfileRepository),
  inject: [Connection],
};
