import { addUser } from '../entity/user.mock';
import { addContact } from '../entity/contact.mock';
import { UserEntity } from '../../src/user/entity/user.entity';
import { ContactEntity } from '../../src/contact/entity/contact.entity';

export const initializeDataset = async (): Promise<{
  users: UserEntity[];
  contacts: ContactEntity[];
}> => {
  const users = await Promise.all([addUser(), addUser()]);
  const contacts = await Promise.all([
    addContact({
      userId: users[0].id,
      active: true,
    }),
    addContact({
      userId: users[1].id,
    }),
  ]);

  return {
    users,
    contacts,
  };
};
