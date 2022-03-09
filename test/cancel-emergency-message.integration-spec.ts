import * as superTest from 'supertest';
import { clearDatabase } from './helper';
import { getTestApp } from './mock/app.mock';
import * as faker from 'faker';
import { JOB_REMOVE_FAILED } from '../src/common/error/keys';
import { MESSAGE_TYPE } from '../src/message/enum/message-type.enum';
import { addUser } from './entity/user.mock';
import { addProfile } from './entity/profile.mock';
import { addContact } from './entity/contact.mock';
import { initializeDataset } from './helper/user';
import { queueServiceMock } from './mock/queue.service.mock';

describe('/message (integration) ', () => {
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

  describe('/message/cancel/emergency (DELETE)', () => {
    it('Should return status 403', async () => {
      await api
        .delete('/message/cancel/emergency')
        .send()
        .expect(({ status }) => {
          expect(status).toBe(403);
        });

      await api
        .delete('/message/cancel/emergency')
        .set('Authorization', faker.datatype.uuid())
        .send()
        .expect(({ status }) => {
          expect(status).toBe(403);
        });
    });

    it('Should return status 400 and error JOB_REMOVE_FAILED for invalid dataset', async () => {
      jest.spyOn(queueServiceMock, 'removeJobs').mockImplementationOnce(
        jest.fn(async () => {
          throw new Error();
        })
      );

      await api
        .delete('/message/cancel/emergency')
        .set('Authorization', dataset.user.id)
        .send()
        .then((result) => {
          expect(result.status).toBe(400);
          expect(result.body.error.code).toBe(JOB_REMOVE_FAILED);
        });
    });

    it('Should return status 200 and valid response', async () => {
      await api
        .delete('/message/cancel/emergency')
        .set('Authorization', dataset.user.id)
        .send()
        .then(({ status, body }) => {
          expect(status).toBe(200);
          expect(body.success).toBeTruthy();
        });
    });
  });
});
