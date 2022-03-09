import * as superTest from 'supertest';
import { clearDatabase } from './helper';
import { getTestApp } from './mock/app.mock';
import { initializeDataset } from './helper/contact';
import * as faker from 'faker';
import {
  VALIDATION_FAILED,
  LOCATION_DATA_IS_NEEDED,
  EMAIL_AND_SMS_NOT_ALLOWED,
  GET_FILE_CONTENT_FAILED,
} from '../src/common/error/keys';
import { addUser } from './entity/user.mock';
import { addProfile } from './entity/profile.mock';
import { CATEGORY } from '../src/file/enum/category.enum';
import { s3Mock } from './mock/s3.mock';

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
      await api
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
          .set('Authorization', dataset.users[0].id)
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
      const user = await addUser();
      user.profile = await addProfile({
        userId: user.id,
        locationAccess: true,
      });

      await api
        .post('/user/message/test')
        .set('Authorization', user.id)
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

    it('Should return status 400 and error GET_FILE_CONTENT_FAILED for invalid dataset', async () => {
      await api
        .post('/file')
        .set('Authorization', dataset.users[0].id)
        .attach('file', `${__dirname}/mock/test.png`)
        .field('category', CATEGORY.MEDICAL_DIRECTIVE)
        .expect(async ({ status }) => {
          expect(status).toBe(201);
        });

      await api
        .post('/file')
        .set('Authorization', dataset.users[1].id)
        .attach('file', `${__dirname}/mock/test.png`)
        .field('category', CATEGORY.MEDICAL_DIRECTIVE)
        .expect(async ({ status }) => {
          expect(status).toBe(201);
        });

      jest
        .spyOn(s3Mock, 'getObject')
        .mockImplementationOnce(
          jest.fn((params, cb) => cb(new Error('error'), {}))
        );

      await api
        .post('/user/message/test')
        .set('Authorization', dataset.users[0].id)
        .send({
          locationUrl: faker.internet.url(),
        })
        .then(({ status, body }) => {
          expect(status).toBe(400);
          expect(body.error.code).toBe(GET_FILE_CONTENT_FAILED);
        });
    });

    it('Should return status 201 and valid body', async () => {
      await api
        .post('/user/message/test')
        .set('Authorization', dataset.users[0].id)
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
