import * as superTest from 'supertest';
import { clearDatabase } from './helper';
import { getTestApp } from './mock/app.mock';
import { initializeDataset } from './helper/user';
import * as faker from 'faker';
import * as moment from 'moment';
import {
  VALIDATION_FAILED,
  SAVE_TIME_SLOT_FAILED,
} from '../src/common/error/keys';
import { getTimeSlotById } from './entity/trigger-time-slot.mock';
import { DAYS_OF_WEEKS } from '../src/trigger-time-slot/enum/days-of-week.enum';
import { getEnumKeys } from '../src/common/helper/get-enum-keys';

describe('/time-slot (integration) ', () => {
  let app;
  let api: superTest.SuperTest<superTest.Test>;
  let dataset: any;

  const notValidDate = [
    null,
    faker.datatype.number(),
    faker.datatype.string(),
    faker.datatype.boolean(),
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

  describe('/time-slot (POST)', () => {
    it('Should return status 403', async () => {
      await api
        .post('/time-slot')
        .send()
        .expect(({ status }) => {
          expect(status).toBe(403);
        });

      return api
        .post('/time-slot')
        .set('Authorization', faker.datatype.uuid())
        .send()
        .expect(({ status }) => {
          expect(status).toBe(403);
        });
    });

    const daysOfWeekKeys = getEnumKeys(DAYS_OF_WEEKS, true);

    for (const value of notValidDate) {
      it(`Should return status 400 and error VALIDATION_FAILED if "to" is ${value}`, async () => {
        await api
          .post('/time-slot')
          .set('Authorization', dataset.user.id)
          .send({
            days: [daysOfWeekKeys[1]],
            to: value,
          })
          .then((result) => {
            expect(result.status).toBe(400);
            expect(result.body.error.code).toBe(VALIDATION_FAILED);
          });

        await api
          .post('/time-slot')
          .set('Authorization', dataset.user.id)
          .send({
            days: [daysOfWeekKeys[1]],
            from: moment().toISOString(),
          })
          .then((result) => {
            expect(result.status).toBe(400);
            expect(result.body.error.code).toBe(VALIDATION_FAILED);
          });
      });
    }

    it('Should return status 400 and error VALIDATION_FAILED if period invalid', async () => {
      await api
        .post('/time-slot')
        .set('Authorization', dataset.user.id)
        .send({
          days: [daysOfWeekKeys[1]],
          from: moment().toISOString(),
        })
        .then(({ status, body }) => {
          expect(status).toBe(400);
          expect(body.error.code).toBe(VALIDATION_FAILED);
        });

      await api
        .post('/time-slot')
        .set('Authorization', dataset.user.id)
        .send({
          days: [daysOfWeekKeys[1]],
          from: moment().toISOString(),
          to: moment().subtract(1, 'days').toISOString(),
        })
        .then(({ status, body }) => {
          expect(status).toBe(400);
          expect(body.error.code).toBe(VALIDATION_FAILED);
        });
    });

    it('Should add contact, return status 201 and valid body', async () => {
      let body;

      ({ body } = await api
        .post('/time-slot')
        .set('Authorization', dataset.user.id)
        .send({
          active: true,
          days: [daysOfWeekKeys[1], daysOfWeekKeys[2]],
          from: moment().toISOString(),
          to: moment().add(1, 'days').toISOString(),
        })
        .expect(async ({ status }) => {
          expect(status).toBe(201);
        }));

      let timeSlot = await getTimeSlotById(body.id);

      expect(timeSlot.active).toBe(true);
      expect(timeSlot.userId).toBe(dataset.user.id);
      expect(timeSlot.id).toBe(body.id);
      expect([DAYS_OF_WEEKS.MONDAY, DAYS_OF_WEEKS.TUESDAY]).toEqual([1, 2]);

      ({ body } = await api
        .post('/time-slot')
        .set('Authorization', dataset.user.id)
        .send({
          days: [daysOfWeekKeys[1]],
          to: moment().add(1, 'days').toISOString(),
        })
        .expect(async ({ status }) => {
          expect(status).toBe(201);
        }));

      ({ body } = await api
        .post('/time-slot')
        .set('Authorization', dataset.user.id)
        .send({
          days: [daysOfWeekKeys[1]],
          to: moment().add(1, 'days').toISOString(),
        })
        .expect(async ({ status }) => {
          expect(status).toBe(201);
        }));

      timeSlot = await getTimeSlotById(body.id);

      expect(timeSlot.active).toBe(false);
      expect(timeSlot.userId).toBe(dataset.user.id);
      expect(timeSlot.id).toBe(body.id);
    });
  });
});
