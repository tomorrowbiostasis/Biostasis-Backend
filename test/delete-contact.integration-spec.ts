import * as superTest from 'supertest';
import { clearDatabase } from './helper';
import { getTestApp } from './mock/app.mock';
import { initializeDataset } from './helper/contact';
import * as faker from 'faker';
import { addContact, getContactById } from './entity/contact.mock';
import { CONTACT_NOT_FOUND } from '../src/common/error/keys';

describe('/contact (integration) ', () => {
  let app;
  let api: superTest.SuperTest<superTest.Test>;
  let dataset: any;

  beforeAll(async () => {
    app = await getTestApp();
    api = superTest(app.getHttpServer());
    await clearDatabase();

    dataset = await initializeDataset();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/contact/:id (DELETE)', () => {
    it('Should return status 403', async () => {
      await api
        .delete(`/contact/${faker.datatype.number()}`)
        .send()
        .expect(({ status }) => {
          expect(status).toBe(403);
        });
    });

    it('Should return status 400 and error CONTACT_NOT_FOUND for invalid dataset', async () => {
      await api
        .delete(`/contact/${dataset.contacts[1].id}`)
        .set('Authorization', dataset.users[0].id)
        .then((result) => {
          expect(result.status).toBe(400);
          expect(result.body.error.code).toBe(CONTACT_NOT_FOUND);
        });

      await api
        .delete(`/contact/${faker.datatype.number()}`)
        .set('Authorization', dataset.users[0].id)
        .then((result) => {
          expect(result.status).toBe(400);
          expect(result.body.error.code).toBe(CONTACT_NOT_FOUND);
        });
    });

    it('Should delete contact, return status 200 and valid body', async () => {
      const contact = await addContact({
        userId: dataset.users[0].id,
      });

      expect(contact).toBeDefined();

      await api
        .delete(`/contact/${contact.id}`)
        .set('Authorization', dataset.users[0].id)
        .send()
        .expect(async ({ status }) => {
          expect(status).toBe(200);
        });

      const contactDB = await getContactById(contact.id);

      expect(contactDB).toBeUndefined();
    });
  });
});
