import { ContactEntity } from '../../src/contact/entity/contact.entity';
import { getConnection } from 'typeorm';
import * as faker from 'faker';
import { omit } from '../../src/common/helper/omit';
import { IContactData } from '../interface/contact-data.interface';

export const getRandomPhoneNumber = (): string =>
  faker.datatype
    .number({
      min: 999,
      max: 999999999999,
    })
    .toString();

export const getRandomPhonePrefix = (): number =>
  faker.datatype.number({
    min: 1,
    max: 999,
  });

export const getContactStub = (data?: IContactData): ContactEntity => {
  const contact = new ContactEntity();

  contact.id = data?.id;
  contact.email = data?.email ?? faker.internet.email();
  contact.phone = data?.phone ?? getRandomPhoneNumber();
  contact.prefix = data?.prefix ?? getRandomPhonePrefix();
  contact.name = data?.name ?? faker.name.firstName();
  contact.surname = data?.surname ?? faker.name.lastName();
  contact.userId = data?.userId;
  contact.active = data?.active ?? faker.datatype.boolean();

  return contact;
};

export const addContact = async (
  data: IContactData
): Promise<ContactEntity> => {
  const contact = getContactStub(data);

  return getConnection().getRepository(ContactEntity).save(contact);
};

export const getContactById = async (id: number): Promise<ContactEntity> => {
  return getConnection().getRepository(ContactEntity).findOne(id);
};

export const checkContact = async (response: any) => {
  const contactId = response.id;
  const contactDB = await getContactById(contactId);

  expect(omit(response, ['createdAt', 'updatedAt'])).toEqual(
    omit({ ...contactDB }, ['createdAt', 'updatedAt', 'userId', 'user'])
  );
  expect(response.createdAt).toBe(contactDB.createdAt.toISOString());
  expect(response.updatedAt).toBe(contactDB.updatedAt.toISOString());
};
