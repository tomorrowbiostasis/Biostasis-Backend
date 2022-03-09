import * as superTest from 'supertest';
import { clearDatabase } from './helper';
import { getTestApp } from './mock/app.mock';
import { initializeDataset } from './helper/contact';
import * as faker from 'faker';
import { getTimeSlotById, addTimeSlot } from './entity/trigger-time-slot.mock';
import { TIME_SLOT_NOT_FOUND } from '../src/common/error/keys';
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

  describe('/time-slot/:id (DELETE)', () => {
    it('Should return status 403', async () => {
      await api
        .delete(`/time-slot/${faker.datatype.number()}`)
        .send()
        .expect(({ status }) => {
          expect(status).toBe(403);
        });

      await api
        .delete(`/time-slot/${faker.datatype.number()}`)
        .set('Authorization', faker.datatype.uuid())
        .send()
        .expect(({ status }) => {
          expect(status).toBe(403);
        });
    });

    it('Should return status 400 and error TIME_SLOT_NOT_FOUND for invalid dataset', async () => {
      const timeSlot = await addTimeSlot({
        userId: dataset.users[1].id,
        days: [{ day: DAYS_OF_WEEKS.MONDAY }],
      });

      await api
        .delete(`/time-slot/${timeSlot.id}`)
        .set('Authorization', dataset.users[0].id)
        .send({
          surname: faker.name.lastName(),
        })
        .then((result) => {
          expect(result.status).toBe(400);
          expect(result.body.error.code).toBe(TIME_SLOT_NOT_FOUND);
        });

      await api
        .delete(`/time-slot/${faker.datatype.number()}`)
        .set('Authorization', dataset.users[0].id)
        .send({
          surname: faker.name.lastName(),
        })
        .then((result) => {
          expect(result.status).toBe(400);
          expect(result.body.error.code).toBe(TIME_SLOT_NOT_FOUND);
        });
    });

    it('Should delete time slot, return status 200 and valid body', async () => {
      const timeSlot = await addTimeSlot({
        userId: dataset.users[0].id,
        days: [{ day: DAYS_OF_WEEKS.MONDAY }],
      });

      expect(timeSlot).toBeDefined();

      await api
        .delete(`/time-slot/${timeSlot.id}`)
        .set('Authorization', dataset.users[0].id)
        .send()
        .expect(async ({ status, body }) => {
          expect(status).toBe(200);
          expect(body.success).toBeTruthy();
        });

      const timeSlotDB = await getTimeSlotById(timeSlot.id);

      expect(timeSlotDB).toBeUndefined();
    });
  });
});
