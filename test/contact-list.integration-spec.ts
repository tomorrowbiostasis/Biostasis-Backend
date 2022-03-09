import * as superTest from 'supertest';
import { clearDatabase } from './helper';
import { getTestApp } from './mock/app.mock';
import { initializeDataset } from './helper/contact';
import * as faker from 'faker';
import { checkContact } from './entity/contact.mock';

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

  describe('/contact (GET)', () => {
    it('Should return status 403', async () => {
      await api
        .get('/contact')
        .send()
        .expect(({ status }) => {
          expect(status).toBe(403);
        });

      await api
        .get('/contact')
        .set('Authorization', faker.datatype.uuid())
        .send()
        .expect(({ status }) => {
          expect(status).toBe(403);
        });
    });

    it('Should return status 200 and valid body', async () => {
      const userId = dataset.users[0].id;
      const { body } = await api
        .get('/contact')
        .set('Authorization', userId)
        .send()
        .expect(async ({ status }) => {
          expect(status).toBe(200);
        });

      for (const contact of body) {
        expect(
          dataset.contacts.find(
            (item) => item.id === contact.id && item.userId === userId
          )
        ).toBeDefined();
        await checkContact(contact);
      }
    });
  });
});
