import { Connection } from 'typeorm';
import { UnconfirmedEmailRepository } from '../repository/unconfirmed-email.repository';

export const UnconfirmedEmailRepositoryProvider = {
  provide: UnconfirmedEmailRepository,
  useFactory: (connection: Connection) =>
    connection.getCustomRepository(UnconfirmedEmailRepository),
  inject: [Connection],
};
