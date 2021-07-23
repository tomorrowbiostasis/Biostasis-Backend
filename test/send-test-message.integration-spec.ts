import * as superTest from 'supertest';
import * as moment from 'moment';
import { clearDatabase } from './helper';
import { getTestApp } from './mock/app.mock';
import { initializeDataset } from './helper/user';
import * as faker from 'faker';
import {
  VALIDATION_FAILED,
  LOCATION_DATA_IS_NEEDED,
  EMAIL_AND_SMS_NOT_ALLOWED,
} from '../src/common/error/keys';
import { addUser } from './entity/user.mock';
import { addProfile } from './entity/profile.mock';

describe('/user/message/test (integration) ', () => {
  let app;
  let api: superTest.SuperTest<superTest.Test>;
  let dataset: any;

  const notValidUrlValue = [
    faker.datatype.boolean(),
    faker.datatype.number(),
    null,
  ];

  beforeAll(async () => {
    app = await getTestApp();
    api = superTest(app.getHttpServer());
    await clearDatabase();

    dataset = await initializeDataset();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/user/message/test (PATCH)', () => {
    it('Should return status 403', async () => {
      return api
        .post('/user/message/test')
        .send()
        .expect(({ status }) => {
          expect(status).toBe(403);
        });
    });

    it('Should return status 400 and error VALIDATION_FAILED for invalid dataset', async () => {
      for (const urlValue of notValidUrlValue) {
        await api
          .post('/user/message/test')
          .set('Authorization', dataset.user.id)
          .send({
            locationUrl: urlValue,
          })
          .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(body.error.code).toBe(VALIDATION_FAILED);
          });
      }
    });

    it('Should return status 400 and error LOCATION_DATA_IS_NEEDED for invalid dataset', async () => {
      await api
        .post('/user/message/test')
        .set('Authorization', dataset.user.id)
        .send({})
        .then((result) => {
          expect(result.status).toBe(400);
          expect(result.body.error.code).toBe(LOCATION_DATA_IS_NEEDED);
        });
    });

    it('Should return status 400 and error EMAIL_AND_SMS_NOT_ALLOWED for invalid dataset', async () => {
      const user = await addUser();
      user.profile = await addProfile({
        userId: user.id,
        emergencyEmailAndSms: false,
      });

      await api
        .post('/user/message/test')
        .set('Authorization', user.id)
        .send({
          locationUrl: faker.internet.url(),
        })
        .then((result) => {
          expect(result.status).toBe(400);
          expect(result.body.error.code).toBe(EMAIL_AND_SMS_NOT_ALLOWED);
        });
    });

    it('Should return status 201 and valid body', async () => {
      await api
        .post('/user/message/test')
        .set('Authorization', dataset.user.id)
        .send({
          locationUrl: faker.internet.url(),
        })
        .then(({ status, body }) => {
          expect(status).toBe(201);
          expect(body.success).toBeTruthy();
        });

      const user = await addUser();
      user.profile = await addProfile({
        userId: user.id,
        locationAccess: false,
        emergencyEmailAndSms: true,
      });

      await api
        .post('/user/message/test')
        .set('Authorization', user.id)
        .send({})
        .then(({ status, body }) => {
          expect(status).toBe(201);
          expect(body.success).toBeTruthy();
        });
    });
  });
});
