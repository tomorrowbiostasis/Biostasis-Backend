import * as superTest from 'supertest';
import * as moment from 'moment';
import { clearDatabase } from './helper';
import { getTestApp } from './mock/app.mock';
import { initializeDataset } from './helper/user';
import * as faker from 'faker';
import { VALIDATION_FAILED } from '../src/common/error/keys';
import {
  getRandomPhoneNumber,
  getRandomPhonePrefix,
} from './entity/contact.mock';
import { checkProfile } from './entity/profile.mock';

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

  describe('/:id (DELETE)', () => {
    it('Should return status 403', async () => {
      return api
        .patch('/user')
        .send()
        .expect(({ status }) => {
          expect(status).toBe(403);
        });
    });
  });

  it('Should return status 400 and error VALIDATION_FAILED for invalid dataset', async () => {
    await api
      .patch('/user')
      .set('Authorization', dataset.user.id)
      .send({
        phone: null,
      })
      .then((result) => {
        expect(result.status).toBe(400);
        expect(result.body.error.code).toBe(VALIDATION_FAILED);
      });

    await api
      .patch('/user')
      .set('Authorization', dataset.user.id)
      .send({
        prefix: null,
      })
      .then((result) => {
        expect(result.status).toBe(400);
        expect(result.body.error.code).toBe(VALIDATION_FAILED);
      });
  });

  it('Should update user profile, return status 200 and valid body', async () => {
    const data = {
      prefix: getRandomPhonePrefix(),
      phone: getRandomPhoneNumber(),
      name: faker.name.findName(),
      surname: faker.name.lastName(),
      address: `${faker.address.streetName()}, ${faker.address.city()}, ${faker.address.country()}`,
      dateOfBirth: moment().format('DD/MM/YYYY'),
    };

    let { body } = await api
      .patch('/user')
      .set('Authorization', dataset.user.id)
      .send(data)
      .expect(async ({ status }) => {
        expect(status).toBe(200);
      });

    await checkProfile(body);

    expect(body.userId).toBe(dataset.user.id);
    expect(body.name).toBe(data.name);
    expect(body.surname).toBe(data.surname);
    expect(body.address).toBe(data.address);
    expect(body.dateOfBirth).toBe(data.dateOfBirth);
    expect(body.prefix).toBe(data.prefix.toString());
    expect(body.phone).toBe(data.phone);

    await api
      .patch('/user')
      .set('Authorization', dataset.user.id)
      .send()
      .expect(async ({ status }) => {
        expect(status).toBe(200);
      });

    const prefix = getRandomPhonePrefix();
    const phone = getRandomPhoneNumber();

    ({ body } = await api
      .patch('/user')
      .set('Authorization', dataset.user.id)
      .send({ prefix, phone })
      .expect(async ({ status }) => {
        expect(status).toBe(200);
      }));

    expect(body.prefix).toBe(prefix.toString());
    expect(body.phone).toBe(phone.toString());
  });
});
