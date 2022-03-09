import * as superTest from 'supertest';
import { clearDatabase } from './helper';
import { getTestApp } from './mock/app.mock';
import { initializeDataset } from './helper/user';
import * as faker from 'faker';
import {
  VALIDATION_FAILED,
  UPDATE_USER_DEVICE_ID_FAILED,
} from '../src/common/error/keys';
import { getUserById } from './entity/user.mock';
import { UserRepository } from '../src/user/repository/user.repository';

describe('/user (integration) ', () => {
  let app;
  let api: superTest.SuperTest<superTest.Test>;
  let dataset: any;

  const notValidDeviceId = [
    faker.datatype.number(),
    faker.datatype.boolean(),
    faker.datatype.string(201),
    undefined,
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

  describe('/user/device (PATCH)', () => {
    it('Should return status 403', async () => {
      await api
        .patch('/user/device')
        .send()
        .expect(({ status }) => {
          expect(status).toBe(403);
        });
    });

    for (const deviceId of notValidDeviceId) {
      it(`Should return status 400 and error VALIDATION_FAILED if device ID is ${deviceId}`, async () =>
        api
          .patch('/user/device')
          .set('Authorization', dataset.user.id)
          .send({
            deviceId,
          })
          .then((result) => {
            expect(result.status).toBe(400);
            expect(result.body.error.code).toBe(VALIDATION_FAILED);
          }));
    }

    it('Should return status 400 and error UPDATE_USER_DEVICE_ID_FAILED', async () => {
      jest.spyOn(UserRepository.prototype, 'update').mockImplementationOnce(
        jest.fn(async () => {
          throw new Error();
        })
      );

      await api
        .patch('/user/device')
        .set('Authorization', dataset.user.id)
        .send({
          deviceId: faker.datatype.string(200),
        })
        .then(({ status, body }) => {
          expect(status).toBe(400);
          expect(body.error.code).toBe(UPDATE_USER_DEVICE_ID_FAILED);
        });
    });

    it('Should update user profile, return status 200 and valid body', async () => {
      const deviceId = faker.datatype.string(200);

      await api
        .patch('/user/device')
        .set('Authorization', dataset.user.id)
        .send({ deviceId })
        .expect(({ status, body }) => {
          expect(status).toBe(200);
          expect(body.success).toBeTruthy();
        });

      let user = await getUserById(dataset.user.id);

      expect(user.deviceId).toBe(deviceId);

      await api
        .patch('/user/device')
        .set('Authorization', dataset.user.id)
        .send({ deviceId: null })
        .expect(({ status, body }) => {
          expect(status).toBe(200);
          expect(body.success).toBeTruthy();
        });

      user = await getUserById(dataset.user.id);

      expect(user.deviceId).toBe(null);
    });
  });
});
