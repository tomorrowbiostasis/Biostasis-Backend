import * as superTest from 'supertest';
import { clearDatabase } from './helper';
import { getTestApp } from './mock/app.mock';
import { initializeDataset } from './helper/user';
import * as faker from 'faker';
import {
  VALIDATION_FAILED,
  SAVE_POSITIVE_INFO_FAILED,
} from '../src/common/error/keys';
import { getPositiveInfoByUserId } from './entity/positive-info.mock';
import { PositiveInfoRepository } from '../src/user/repository/positive-info.repository';

describe('/user (integration) ', () => {
  let app;
  let api: superTest.SuperTest<superTest.Test>;
  let dataset: any;

  const notValidPeriod = [
    null,
    faker.datatype.boolean(),
    faker.datatype.string(201),
    undefined,
    89,
    721,
  ];
  const notValidLocation = [
    faker.datatype.boolean(),
    faker.datatype.number(),
    faker.datatype.string(201),
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

  describe('/user/positive-info (PATCH)', () => {
    it('Should return status 403', async () => {
      return api
        .post('/user/positive-info')
        .send()
        .expect(({ status }) => {
          expect(status).toBe(403);
        });
    });

    for (const minutesToNext of notValidPeriod) {
      it(`Should return status 400 and error VALIDATION_FAILED if minutesToNext is ${minutesToNext}`, async () =>
        api
          .post('/user/positive-info')
          .set('Authorization', dataset.user.id)
          .send({
            minutesToNext,
          })
          .then((result) => {
            expect(result.status).toBe(400);
            expect(result.body.error.code).toBe(VALIDATION_FAILED);
          }));
    }

    for (const locationUrl of notValidLocation) {
      it(`Should return status 400 and error VALIDATION_FAILED if locationUrl is ${locationUrl}`, async () =>
        api
          .post('/user/positive-info')
          .set('Authorization', dataset.user.id)
          .send({
            minutesToNext: 90,
            locationUrl,
          })
          .then((result) => {
            expect(result.status).toBe(400);
            expect(result.body.error.code).toBe(VALIDATION_FAILED);
          }));
    }

    it('Should return status 400 and error SAVE_POSITIVE_INFO_FAILED', async () => {
      jest
        .spyOn(PositiveInfoRepository.prototype, 'save')
        .mockImplementationOnce(
          jest.fn(async () => {
            throw new Error();
          })
        );

      await api
        .post('/user/positive-info')
        .set('Authorization', dataset.user.id)
        .send({
          minutesToNext: 90,
        })
        .then(({ status, body }) => {
          expect(status).toBe(400);
          expect(body.error.code).toBe(SAVE_POSITIVE_INFO_FAILED);
        });
    });

    it('Should note positive info, return status 200 and valid body', async () => {
      let minutesToNext = 90;
      let locationUrl = faker.datatype.string(200);

      await api
        .post('/user/positive-info')
        .set('Authorization', dataset.user.id)
        .send({ minutesToNext, locationUrl })
        .expect(({ status, body }) => {
          expect(status).toBe(201);
          expect(body.success).toBeTruthy();
        });

      const item = await getPositiveInfoByUserId(dataset.user.id);

      expect(item.minutesToNext).toBe(minutesToNext);
      expect(item.location).toBe(locationUrl);

      await api
        .post('/user/positive-info')
        .set('Authorization', dataset.user.id)
        .send({ minutesToNext })
        .expect(({ status, body }) => {
          expect(status).toBe(201);
          expect(body.success).toBeTruthy();
        });

      let newItem = await getPositiveInfoByUserId(dataset.user.id);

      expect(item.updatedAt).toBeDefined();
      expect(item.id).toBe(newItem.id);
      expect(item.updatedAt !== newItem.updatedAt).toBeTruthy();

      minutesToNext = 91;
      locationUrl = faker.datatype.string(200);

      await api
        .post('/user/positive-info')
        .set('Authorization', dataset.user.id)
        .send({ minutesToNext, locationUrl })
        .expect(({ status, body }) => {
          expect(status).toBe(201);
          expect(body.success).toBeTruthy();
        });

      newItem = await getPositiveInfoByUserId(dataset.user.id);

      expect(item.id).toBe(newItem.id);
      expect(newItem.minutesToNext).toBe(minutesToNext);
      expect(newItem.minutesToNext).toBe(minutesToNext);
    });
  });
});
