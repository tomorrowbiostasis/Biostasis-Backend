import * as superTest from 'supertest';
import { clearDatabase } from './helper';
import { getTestApp } from './mock/app.mock';
import { initializeDataset } from './helper/user';
import { checkUser } from './entity/user.mock';

describe('/user (integration) ', () => {
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

  describe('/user (GET)', () => {
    it('Should return status 403', async () => {
      return api
        .get('/user')
        .send()
        .expect(({ status }) => {
          expect(status).toBe(403);
        });
    });
  });
});
