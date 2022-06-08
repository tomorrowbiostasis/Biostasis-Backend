import * as superTest from 'supertest';
import { clearDatabase } from './helper';
import { getTestApp } from './mock/app.mock';
import { initializeDataset } from './helper/user';
import * as faker from 'faker';
import * as moment from 'moment';
import { getUserById } from './entity/user.mock';
import { DAYS_OF_WEEKS } from '../src/trigger-time-slot/enum/days-of-week.enum';
import { getEnumKeys } from '../src/common/helper/get-enum-keys';
import { CATEGORY } from '../src/file/enum/category.enum';

describe('/user (integration) ', () => {
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

  describe('/user (DELETE)', () => {
    it('Should return status 403', async () => {
      await api
        .delete('/user')
        .send()
        .expect(({ status }) => {
          expect(status).toBe(403);
        });

      await api
        .delete('/user')
        .set('Authorization', faker.datatype.uuid())
        .send()
        .expect(({ status }) => {
          expect(status).toBe(403);
        });
    });

    it('Should delete user, return status 200 and valid body', async () => {
      const daysOfWeekKeys = getEnumKeys(DAYS_OF_WEEKS, true);

      await api
        .post('/time-slot')
        .set('Authorization', dataset.user.id)
        .send({
          active: true,
          days: [daysOfWeekKeys[1], daysOfWeekKeys[2]],
          from: moment().toISOString(),
          to: moment().add(1, 'days').toISOString(),
          timezone: '+02:00'
        })
        .expect(201);

      await api
        .post('/contact')
        .set('Authorization', dataset.user.id)
        .send({
          prefix: faker.datatype.number(999),
          phone: faker.datatype.number(999999999999).toString(),
          name: faker.name.findName(),
          surname: faker.name.lastName(),
          active: true,
          email: faker.internet.email(),
        })
        .expect(201);

      await api
        .post('/file')
        .set('Authorization', dataset.user.id)
        .attach('file', `${__dirname}/mock/test.png`)
        .field('category', CATEGORY.MEDICAL_DIRECTIVE)
        .expect(201);

      await api
        .patch('/api/v2/user')
        .set('Authorization', dataset.user.id)
        .send({ email: faker.internet.email() })
        .expect(async ({ status }) => {
          expect(status).toBe(200);
        });

      await api
        .delete('/user')
        .set('Authorization', dataset.user.id)
        .send()
        .expect(async ({ status, body }) => {
          expect(status).toBe(200);
        });

      const userDB = await getUserById(dataset.user.id);

      expect(userDB).toBeUndefined();
    });
  });
});
