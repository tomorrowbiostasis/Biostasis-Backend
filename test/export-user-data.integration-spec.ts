import * as superTest from 'supertest';
import { clearDatabase } from './helper';
import { getTestApp } from './mock/app.mock';
import { initializeDataset } from './helper/user';
import * as faker from 'faker';
import {
  VALIDATION_FAILED,
  LOCATION_DATA_IS_NEEDED,
  EMAIL_AND_SMS_NOT_ALLOWED,
  EXPORT_DATA_FAILED,
} from '../src/common/error/keys';
import { addUser } from './entity/user.mock';
import { addProfile } from './entity/profile.mock';
import { ExportService } from '../src/user/service/export.service';

describe('/user/export (integration) ', () => {
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

  describe('/user/export (PATCH)', () => {
    it('Should return status 403', async () => {
      await api
        .post('/user/export')
        .send()
        .expect(({ status }) => {
          expect(status).toBe(403);
        });

      return api
        .post('/user/export')
        .set('Authorization', faker.datatype.uuid())
        .send()
        .expect(({ status }) => {
          expect(status).toBe(403);
        });
    });

    it('Should return status 400 and error EXPORT_DATA_FAILED for invalid dataset', async () => {
      jest
        .spyOn(ExportService.prototype, 'exportDataAsBase64')
        .mockImplementationOnce(jest.fn(() => null));

      await api
        .post('/user/export')
        .set('Authorization', dataset.user.id)
        .send({})
        .then((result) => {
          expect(result.status).toBe(400);
          expect(result.body.error.code).toBe(EXPORT_DATA_FAILED);
        });
    });

    it('Should return status 201 and valid body', async () => {
      await api
        .post('/user/export')
        .set('Authorization', dataset.user.id)
        .send({
          locationUrl: faker.internet.url(),
        })
        .then(({ status, body }) => {
          expect(status).toBe(201);
          expect(body.success).toBeTruthy();
        });
    });
  });
});
