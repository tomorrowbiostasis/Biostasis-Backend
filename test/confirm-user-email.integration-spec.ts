import * as superTest from 'supertest';
import { clearDatabase } from './helper';
import { getTestApp } from './mock/app.mock';
import { initializeDataset } from './helper/user';
import * as faker from 'faker';
import { VALIDATION_FAILED } from '../src/common/error/keys';
import { getUnconfirmedEmailByUserId } from './entity/uncofirmed-email.mock';
import { getUserById } from './entity/user.mock';

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

  describe('/user/email/confirm (PATCH)', () => {
    it('Should return status 400 and error VALIDATION_FAILED for invalid dataset', async () => {
      await api
        .patch('/user/email/confirm')
        .set('Authorization', dataset.user.id)
        .send({
          code: null,
        })
        .then((result) => {
          expect(result.status).toBe(400);
          expect(result.body.error.code).toBe(VALIDATION_FAILED);
        });
    });

    it('Should update user profile, return status 200 and valid body', async () => {
      const email = faker.internet.email();

      await api
        .patch('/api/v2/user')
        .set('Authorization', dataset.user.id)
        .send({ email })
        .expect(async ({ status }) => {
          expect(status).toBe(200);
        });

      let unconfirmedEmail = await getUnconfirmedEmailByUserId(dataset.user.id);

      await api
        .patch('/user/email/confirm')
        .send({ code: unconfirmedEmail.code })
        .expect(async ({ status, body }) => {
          expect(status).toBe(200);
          expect(body?.success).toBeTruthy();
        });

      const user = await getUserById(dataset.user.id);

      expect(user.email).toBe(email);

      unconfirmedEmail = await getUnconfirmedEmailByUserId(dataset.user.id);

      expect(unconfirmedEmail).toBeUndefined();
    });
  });
});
