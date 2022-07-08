import * as superTest from 'supertest';
import { clearDatabase } from './helper';
import { getTestApp } from './mock/app.mock';
import { initializeDataset } from './helper/contact';
import * as faker from 'faker';
import { EntityManager } from 'typeorm';
import {
  TIME_SLOT_NOT_FOUND,
  UPDATE_TIME_SLOT_FAILED,
} from '../src/common/error/keys';
import { DAYS_OF_WEEKS } from '../src/trigger-time-slot/enum/days-of-week.enum';
import { getEnumKeys } from '../src/common/helper/get-enum-keys';
import * as moment from 'moment';
import {
  getTimeSlotById,
  checkTimeSlot,
} from './entity/trigger-time-slot.mock';
import { getEnumKeyByValue } from '../src/common/helper/get-enum-key-by-value';

describe('/time-slot (integration) ', () => {
  let app;
  let api: superTest.SuperTest<superTest.Test>;
  let dataset: any;
  const daysOfWeekKeys = getEnumKeys(DAYS_OF_WEEKS, true);

  beforeAll(async () => {
    app = await getTestApp();
    api = superTest(app.getHttpServer());
    await clearDatabase();

    dataset = await initializeDataset();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/time-slot/:id (PATCH)', () => {
    it('Should return status 403', async () => {
      await api
        .patch(`/time-slot/${faker.datatype.number()}`)
        .send()
        .expect(({ status }) => {
          expect(status).toBe(403);
        });
    });

    it('Should return status 400 and error TIME_SLOT_NOT_FOUND for invalid dataset', async () => {
      await api
        .patch(`/time-slot/${faker.datatype.number()}`)
        .set('Authorization', dataset.users[0].id)
        .send({
          active: true,
          days: [daysOfWeekKeys[1], daysOfWeekKeys[2]],
          from: moment().toISOString(),
          to: moment().add(1, 'days').toISOString(),
          timezone: '+02:00'
        })
        .then((result) => {
          expect(result.status).toBe(400);
          expect(result.body.error.code).toBe(TIME_SLOT_NOT_FOUND);
        });
    });

    it('Should not modify data, return status 400 and error UPDATE_TIME_SLOT_FAILED', async () => {
      jest.spyOn(EntityManager.prototype, 'delete').mockImplementationOnce(
        jest.fn(async () => {
          throw new Error();
        })
      );

      let body;
      const params = {
        active: true,
        days: [daysOfWeekKeys[1], daysOfWeekKeys[2]],
        from: moment().toISOString(),
        to: moment().add(2, 'days').toISOString(),
        timezone: '+02:00'
      };

      ({ body } = await api
        .post('/time-slot')
        .set('Authorization', dataset.users[0].id)
        .send(params)
        .expect(async ({ status }) => {
          expect(status).toBe(201);
        }));

      await api
        .patch(`/time-slot/${body.id}`)
        .set('Authorization', dataset.users[0].id)
        .send({
          active: false,
          days: [daysOfWeekKeys[1], daysOfWeekKeys[2], daysOfWeekKeys[3]],
          from: moment().toISOString(),
          to: moment().add(1, 'days').toISOString(),
          timezone: '+02:00'
        })
        .then((result) => {
          expect(result.status).toBe(400);
          expect(result.body.error.code).toBe(UPDATE_TIME_SLOT_FAILED);
        });

      const timeSlot = await getTimeSlotById(body.id);

      expect(params).toEqual({
        active: timeSlot.active,
        days: timeSlot.days.map((item) =>
          getEnumKeyByValue(DAYS_OF_WEEKS, item.day)
        ),
        from: timeSlot.from.toISOString(),
        to: timeSlot.to.toISOString(),
        timezone: '+02:00'
      });
    });

    it('Should update time slot, return status 200 and valid body', async () => {
      let body;
      const params = {
        active: true,
        days: [daysOfWeekKeys[1], daysOfWeekKeys[2]],
        from: moment().toISOString(),
        to: moment().add(2, 'days').toISOString(),
        timezone: '+02:00'
      };

      ({ body } = await api
        .post('/time-slot')
        .set('Authorization', dataset.users[0].id)
        .send(params)
        .expect(async ({ status }) => {
          expect(status).toBe(201);
        }));

      await api
        .patch(`/time-slot/${body.id}`)
        .set('Authorization', dataset.users[0].id)
        .send({
          active: false,
          days: [daysOfWeekKeys[1], daysOfWeekKeys[2], daysOfWeekKeys[3]],
          from: moment().toISOString(),
          to: moment().add(1, 'days').toISOString(),
          timezone: '+02:00'
        })
        .then(({ status, body }) => {
          expect(status).toBe(200);
          checkTimeSlot(body);
        });
    });
  });
});
