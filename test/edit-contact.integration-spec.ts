import * as superTest from 'supertest';
import { clearDatabase } from './helper';
import { getTestApp } from './mock/app.mock';
import { initializeDataset } from './helper/contact';
import * as faker from 'faker';
import {
  checkContact,
  getRandomPhoneNumber,
  getRandomPhonePrefix,
} from './entity/contact.mock';
import { CONTACT_NOT_FOUND, VALIDATION_FAILED } from '../src/common/error/keys';

describe('/contact (integration) ', () => {
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

  describe('/:id (PATCH)', () => {
    it('Should return status 403', async () => {
      return api
        .patch(`/contact/${faker.datatype.number()}`)
        .send()
        .expect(({ status }) => {
          expect(status).toBe(403);
        });
    });
  });

  it('Should return status 400 and error CONTACT_NOT_FOUND for invalid dataset', async () => {
    return api
      .patch(`/contact/${faker.datatype.number()}`)
      .set('Authorization', dataset.users[0].id)
      .send({
        surname: faker.name.lastName(),
      })
      .then((result) => {
        expect(result.status).toBe(400);
        expect(result.body.error.code).toBe(CONTACT_NOT_FOUND);
      });
  });

  it('Should return status 400 and error VALIDATION_FAILED for invalid dataset', async () => {
    const contact = dataset.contacts[0];

    await api
      .patch(`/contact/${contact.id}`)
      .set('Authorization', dataset.users[0].id)
      .send({
        email: null,
      })
      .then((result) => {
        expect(result.status).toBe(400);
        expect(result.body.error.code).toBe(VALIDATION_FAILED);
      });

    await api
      .patch(`/contact/${contact.id}`)
      .set('Authorization', dataset.users[0].id)
      .send({
        phone: null,
      })
      .then((result) => {
        expect(result.status).toBe(400);
        expect(result.body.error.code).toBe(VALIDATION_FAILED);
      });

    await api
      .patch(`/contact/${contact.id}`)
      .set('Authorization', dataset.users[0].id)
      .send({
        prefix: null,
      })
      .then((result) => {
        expect(result.status).toBe(400);
        expect(result.body.error.code).toBe(VALIDATION_FAILED);
      });

    return api
      .patch(`/contact/${contact.id}`)
      .set('Authorization', dataset.users[0].id)
      .send({
        phone: null,
        prefix: null,
      })
      .then((result) => {
        expect(result.status).toBe(400);
        expect(result.body.error.code).toBe(VALIDATION_FAILED);
      });
  });

  it('Should update contact, return status 200 and valid body', async () => {
    const contact = dataset.contacts[0];
    const data = {
      prefix: getRandomPhonePrefix(),
      phone: getRandomPhoneNumber(),
      name: faker.name.findName(),
      surname: faker.name.lastName(),
      active: false,
      email: faker.internet.email(),
    };
    let { body } = await api
      .patch(`/contact/${contact.id}`)
      .set('Authorization', dataset.users[0].id)
      .send(data)
      .expect(async ({ status }) => {
        expect(status).toBe(200);
      });

    await checkContact(body);

    expect(body.id).toBe(contact.id);
    expect(body.name).toBe(data.name);
    expect(body.surname).toBe(data.surname);
    expect(body.active).toBe(data.active);
    expect(body.prefix).toBe(data.prefix.toString());
    expect(body.phone).toBe(data.phone);

    await api
      .patch(`/contact/${contact.id}`)
      .set('Authorization', dataset.users[0].id)
      .send({ name: faker.name.findName(), surname: faker.name.lastName() })
      .expect(async ({ status }) => {
        expect(status).toBe(200);
      });

    await api
      .patch(`/contact/${contact.id}`)
      .set('Authorization', dataset.users[0].id)
      .send({ email: faker.internet.email() })
      .expect(async ({ status }) => {
        expect(status).toBe(200);
      });

    await api
      .patch(`/contact/${contact.id}`)
      .set('Authorization', dataset.users[0].id)
      .send({ prefix: getRandomPhonePrefix(), phone: getRandomPhoneNumber() })
      .expect(async ({ status }) => {
        expect(status).toBe(200);
      });
  });
});
