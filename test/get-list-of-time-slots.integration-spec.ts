import * as superTest from 'supertest';
import * as moment from 'moment';
import * as faker from 'faker';
import { clearDatabase } from './helper';
import { getTestApp } from './mock/app.mock';
import { initializeDataset } from './helper/user';
import {
  getTimeSlotById,
  checkTimeSlot,
} from './entity/trigger-time-slot.mock';
import { queueServiceMock } from './mock/queue.service.mock';
import { getEnumKeys } from '../src/common/helper/get-enum-keys';
import { DAYS_OF_WEEKS } from '../src/trigger-time-slot/enum/days-of-week.enum';

describe('/time-slot (integration) ', () => {
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

  describe('/time-slot (GET)', () => {
    it('Should return status 403', async () => {
      await api
        .get('/time-slot')
        .send()
        .expect(({ status }) => {
          expect(status).toBe(403);
        });

      await api
        .get('/time-slot')
        .set('Authorization', faker.datatype.uuid())
        .send()
        .expect(({ status }) => {
          expect(status).toBe(403);
        });
    });

    it('Should return status 200 and valid body', async () => {
      const daysOfWeekKeys = getEnumKeys(DAYS_OF_WEEKS, true);

      await Promise.all([
        api
          .post('/time-slot')
          .set('Authorization', dataset.user.id)
          .send({
            active: true,
            days: [daysOfWeekKeys[1], daysOfWeekKeys[2]],
            from: moment().toISOString(),
            to: moment().add(1, 'days').toISOString(),
          }),
        api
          .post('/time-slot')
          .set('Authorization', dataset.user.id)
          .send({
            active: false,
            days: [daysOfWeekKeys[6]],
            to: moment().add(2, 'days').toISOString(),
          }),
      ]);

      const { body } = await api
        .get('/time-slot')
        .set('Authorization', dataset.user.id)
        .send()
        .expect(({ status }) => {
          expect(status).toBe(200);
        });

      for (const item of body) {
        checkTimeSlot(item);
      }
    });
  });
});
