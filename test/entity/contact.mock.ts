import { ContactEntity } from '../../src/contact/entity/contact.entity';
import { getConnection } from 'typeorm';
import { omit } from '../../src/common/helper/omit';

export const getContactById = async (id: string): Promise<ContactEntity> => {
  return getConnection().getRepository(ContactEntity).findOne(id);
};

export const checkContact = async (response: any) => {
  const contactId = response.id;
  const contactDB = await getContactById(contactId);

  expect(omit(response, ['createdAt', 'updatedAt'])).toEqual(
    omit({ ...contactDB, prefix: Number(contactDB.prefix) }, [
      'createdAt',
      'updatedAt',
      'userId',
      'user',
    ])
  );
  expect(response.createdAt).toBe(contactDB.createdAt.toISOString());
  expect(response.updatedAt).toBe(contactDB.updatedAt.toISOString());
};
