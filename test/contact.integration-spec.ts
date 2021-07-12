import * as superTest from 'supertest';
import { clearDatabase } from './helper';
import { getTestApp } from './mock/app.mock';
import { initializeDataset } from './helper/contact';
import * as faker from 'faker';
import { checkContact } from './entity/contact.mock';
import { VALIDATION_FAILED } from '../src/common/error/keys';

describe('/contact (integration) ', () => {
  let app;
  let api: superTest.SuperTest<superTest.Test>;
  let dataset: any;
  const notValidPrefix = [
    0,
    faker.datatype.number({
      min: 1000,
    }),
  ];
  const notValidPhone = [
    faker.datatype.number({
      max: 999,
    }),
    faker.datatype.number({
      min: 10000000000000,
    }),
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

  describe('/ (POST)', () => {
    it('Should return status 403', async () => {
      await api
        .post('/contact')
        .send()
        .expect(({ status }) => {
          expect(status).toBe(403);
        });

      return api
        .post('/contact')
        .set('Authorization', faker.datatype.uuid())
        .send()
        .expect(({ status }) => {
          expect(status).toBe(403);
        });
    });

    for (const prefix of notValidPrefix) {
      it(`Should return status 400 and error VALIDATION_FAILED if prefix is ${prefix}`, async () => {
        return api
          .post('/contact')
          .set('Authorization', dataset.user.id)
          .send({
            prefix,
            phone: faker.datatype.number(999999999999).toString(),
            name: faker.name.findName(),
            surname: faker.name.lastName(),
            active: true,
            email: faker.internet.email(),
          })
          .then((result) => {
            expect(result.status).toBe(400);
            expect(result.body.error.code).toBe(VALIDATION_FAILED);
          });
      });
    }

    for (const phone of notValidPhone) {
      it(`Should return status 400 and error VALIDATION_FAILED if phone is ${phone}`, async () => {
        return api
          .post('/contact')
          .set('Authorization', dataset.user.id)
          .send({
            prefix: faker.datatype.number(999),
            phone: phone.toString(),
            name: faker.name.findName(),
            surname: faker.name.lastName(),
            active: true,
            email: faker.internet.email(),
          })
          .then((result) => {
            expect(result.status).toBe(400);
            expect(result.body.error.code).toBe(VALIDATION_FAILED);
          });
      });
    }

    it('Should return status 400 and error VALIDATION_FAILED for invalid dataset', async () => {
      const phone = faker.datatype
        .number({
          min: 999,
          max: 999999999999,
        })
        .toString();
      const prefix = faker.datatype.number({
        min: 1,
        max: 999,
      });

      await api
        .post('/contact')
        .set('Authorization', dataset.user.id)
        .send({
          phone,
          name: faker.name.findName(),
          surname: faker.name.lastName(),
          active: true,
          email: faker.internet.email(),
        })
        .then((result) => {
          expect(result.status).toBe(400);
          expect(result.body.error.code).toBe(VALIDATION_FAILED);
        });

      await api
        .post('/contact')
        .set('Authorization', dataset.user.id)
        .send({
          prefix,
          name: faker.name.findName(),
          surname: faker.name.lastName(),
          active: true,
          email: faker.internet.email(),
        })
        .then((result) => {
          expect(result.status).toBe(400);
          expect(result.body.error.code).toBe(VALIDATION_FAILED);
        });

      await api
        .post('/contact')
        .set('Authorization', dataset.user.id)
        .send({
          name: faker.name.findName(),
          surname: faker.name.lastName(),
          active: true,
        })
        .then((result) => {
          expect(result.status).toBe(400);
          expect(result.body.error.code).toBe(VALIDATION_FAILED);
        });

      await api
        .post('/contact')
        .set('Authorization', dataset.user.id)
        .send({
          name: faker.name.findName(),
          surname: faker.name.lastName(),
          active: true,
          email: faker.internet.email(),
        })
        .then((result) => {
          expect(result.status).toBe(201);
        });

      return api
        .post('/contact')
        .set('Authorization', dataset.user.id)
        .send({
          name: faker.name.findName(),
          surname: faker.name.lastName(),
          active: true,
          phone,
          prefix,
        })
        .then((result) => {
          expect(result.status).toBe(201);
        });
    });

    it('Should add contact, return status 201 and valid body', async () => {
      const { body } = await api
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
        .expect(async ({ status, body }) => {
          expect(status).toBe(201);
        });

      await checkContact(body);
    });
  });
});
