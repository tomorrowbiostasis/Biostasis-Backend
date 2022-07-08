import * as superTest from 'supertest';
import { clearDatabase } from './helper';
import { getTestApp } from './mock/app.mock';
import { initializeDataset } from './helper/user';
import { checkUser } from './entity/user.mock';
import { queueServiceMock } from './mock/queue.service.mock';

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
      await api
        .get('/user')
        .send()
        .expect(({ status }) => {
          expect(status).toBe(403);
        });
    });

    it('Should return status 200 and valid body', async () => {
      const userId = dataset.user.id;
      let { body } = await api
        .get('/user')
        .set('Authorization', userId)
        .send()
        .expect(async ({ status }) => {
          expect(status).toBe(200);
        });

      expect(body.id).toBe(userId);
      expect(body.fillLevel).toBe(100);
      expect(body.isEmergencyTriggerActive).toBeTruthy();

      await checkUser(body);

      jest
        .spyOn(queueServiceMock, 'getJob')
        .mockImplementation(jest.fn(async () => null));

      ({ body } = await api
        .get('/user')
        .set('Authorization', userId)
        .send()
        .expect(async ({ status }) => {
          expect(status).toBe(200);
        }));

      expect(body.isEmergencyTriggerActive).toBeFalsy();
    });
  });
});
