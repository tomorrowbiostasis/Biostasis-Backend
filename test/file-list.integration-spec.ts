import * as superTest from 'supertest';
import { clearDatabase } from './helper';
import { getTestApp } from './mock/app.mock';
import { initializeDataset } from './helper/contact';
import * as faker from 'faker';
import { getCategories } from './entity/category.mock';
import { getFiles } from './entity/file.mock';
import { CATEGORY } from '../src/file/enum/category.enum';

describe('/file (integration) ', () => {
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

  describe('/file (GET)', () => {
    it('Should return status 403', async () => {
      await api
        .get('/file')
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
      await Promise.all([
        api
          .post('/file')
          .set('Authorization', dataset.users[0].id)
          .attach('file', `${__dirname}/mock/test.png`)
          .field('category', CATEGORY.MEDICAL_DIRECTIVE),
        api
          .post('/file')
          .set('Authorization', dataset.users[0].id)
          .attach('file', `${__dirname}/mock/test.png`)
          .field('category', CATEGORY.OTHER),
        api
          .post('/file')
          .set('Authorization', dataset.users[0].id)
          .attach('file', `${__dirname}/mock/test.png`)
          .field('category', CATEGORY.OTHER),
        api
          .post('/file')
          .set('Authorization', dataset.users[1].id)
          .attach('file', `${__dirname}/mock/test.png`)
          .field('category', CATEGORY.LAST_WILL),
      ]);

      const { body } = await api
        .get('/file')
        .set('Authorization', dataset.users[0].id)
        .send()
        .expect(async ({ status }) => {
          expect(status).toBe(200);
        });

      const categories = await getCategories();
      const otherFiles = body.find(
        (item) => item.code === CATEGORY.OTHER
      ).files;

      expect(categories.map((category) => category.code)).toEqual(
        body.map((item) => item.code)
      );
      expect(
        body.find((item) => item.code === CATEGORY.MEDICAL_DIRECTIVE).files
          .length
      ).toBe(1);
      expect(
        body.find((item) => item.code === CATEGORY.LAST_WILL).files.length
      ).toBe(0);
      expect(otherFiles.length).toBe(2);
      expect(Object.keys(otherFiles[0])).toEqual([
        'id',
        'name',
        'mimeType',
        'createdAt',
      ]);
    });
  });
});
