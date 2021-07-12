import { Connection } from 'typeorm';
import { ContactRepository } from '../repository/contact.repository';

export const ContactRepositoryProvider = {
  provide: ContactRepository,
  useFactory: (connection: Connection) =>
    connection.getCustomRepository(ContactRepository),
  inject: [Connection],
};
