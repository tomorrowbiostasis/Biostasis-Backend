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
import {
  checkTimeSlot,
  getTimeSlotById,
} from './entity/trigger-time-slot.mock';
import { DAYS_OF_WEEKS } from '../src/trigger-time-slot/enum/days-of-week.enum';
import { getEnumKeys } from '../src/common/helper/get-enum-keys';
import { getEnumKeyByValue } from '../src/common/helper/get-enum-key-by-value';
import { MessageService } from '../src/message/service/mesage.service';

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
      jest.spyOn(MessageService.prototype, 'sendMessageToDevice').mockResolvedValue(null);

      await api
        .post('/time-slot')
        .send()
        .expect(({ status }) => {
          expect(status).toBe(403);
        });

      await api
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
            timezone: '+02:00'
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
            timezone: '+02:00'
          })
          .then((result) => {
            expect(result.status).toBe(400);
            expect(result.body.error.code).toBe(VALIDATION_FAILED);
          });
      });
    }

    it('Should return status 400 and error VALIDATION_FAILED if period invalid', async () => {
      jest.spyOn(MessageService.prototype, 'sendMessageToDevice').mockResolvedValue(null);

      await api
        .post('/time-slot')
        .set('Authorization', dataset.user.id)
        .send({
          days: [daysOfWeekKeys[1]],
          from: moment().toISOString(),
          timezone: '+02:00'
        })
        .then(({ status, body }) => {
          expect(status).toBe(400);
          expect(body.error.code).toBe(VALIDATION_FAILED);
        });
    });

    it('Should update time slot if time slot without start time exists', async () => {
      jest.spyOn(MessageService.prototype, 'sendMessageToDevice').mockResolvedValue(null);

      let params = {
        active: true,
        days: [daysOfWeekKeys[1], daysOfWeekKeys[2]],
        to: moment().add(7, 'days').toISOString(),
        timezone: '+02:00'
      };

      const { body: firstCall } = await api
        .post('/time-slot')
        .set('Authorization', dataset.user.id)
        .send({
          active: true,
          days: [daysOfWeekKeys[1], daysOfWeekKeys[2]],
          to: moment().add(7, 'days').toISOString(),
          timezone: '+02:00'
        })
        .expect(async ({ status }) => {
          expect(status).toBe(201);
        });

      let timeSlot = await getTimeSlotById(firstCall.id);

      expect({
        ...params,
        to: moment(params.to).format('YYYY-MM-DD HH:mm:ss'),
      }).toEqual({
        active: timeSlot.active,
        days: timeSlot.days.map((item) =>
          getEnumKeyByValue(DAYS_OF_WEEKS, item.day)
        ),
        to: moment(timeSlot.to).format('YYYY-MM-DD HH:mm:ss'),
        timezone: '+02:00'
      });

      params = {
        active: false,
        days: [daysOfWeekKeys[1], daysOfWeekKeys[2]],
        to: moment().add(5, 'days').toISOString(),
        timezone: '+02:00'
      };

      const { body: secondCall } = await api
        .post('/time-slot')
        .set('Authorization', dataset.user.id)
        .send(params)
        .expect(async ({ status }) => {
          expect(status).toBe(201);
        });

      timeSlot = await getTimeSlotById(firstCall.id);

      expect({
        ...params,
        to: moment(params.to).format('YYYY-MM-DD HH:mm:ss'),
      }).toEqual({
        active: timeSlot.active,
        days: timeSlot.days.map((item) =>
          getEnumKeyByValue(DAYS_OF_WEEKS, item.day)
        ),
        to: moment(timeSlot.to).format('YYYY-MM-DD HH:mm:ss'),
        timezone: '+02:00'
      });

      expect(firstCall.id).toBe(secondCall.id);
    });

    it('Should add time slot, return status 201 and valid body', async () => {
      jest.spyOn(MessageService.prototype, 'sendMessageToDevice').mockResolvedValue(null);

      let body;

      ({ body } = await api
        .post('/time-slot')
        .set('Authorization', dataset.user.id)
        .send({
          active: true,
          days: [daysOfWeekKeys[1], daysOfWeekKeys[2]],
          from: moment().toISOString(),
          to: moment().add(1, 'days').toISOString(),
          timezone: '+02:00'
        })
        .expect(async ({ status }) => {
          expect(status).toBe(201);
        }));

      let timeSlot = await getTimeSlotById(body.id);

      expect(timeSlot.active).toBe(true);
      expect(timeSlot.userId).toBe(dataset.user.id);
      expect(timeSlot.id).toBe(body.id);
      expect([DAYS_OF_WEEKS.MONDAY, DAYS_OF_WEEKS.TUESDAY]).toEqual([2, 3]);

      ({ body } = await api
        .post('/time-slot')
        .set('Authorization', dataset.user.id)
        .send({
          days: [daysOfWeekKeys[1]],
          to: moment().add(1, 'days').toISOString(),
          timezone: '+02:00'
        })
        .expect(async ({ status }) => {
          expect(status).toBe(201);
        }));

      ({ body } = await api
        .post('/time-slot')
        .set('Authorization', dataset.user.id)
        .send({
          days: [daysOfWeekKeys[1]],
          from: null,
          to: moment().add(1, 'days').toISOString(),
          timezone: '+02:00'
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
