import * as superTest from 'supertest';
import { clearDatabase } from './helper';
import { getTestApp } from './mock/app.mock';
import { initializeDataset } from './helper/contact';
import * as faker from 'faker';
import {
  getRandomPhoneNumber,
  getRandomPhonePrefix,
} from './entity/contact.mock';
import {
  VALIDATION_FAILED,
  PHONE_NUMBER_IS_INVALID,
} from '../src/common/error/keys';
import { getContactById } from './entity/contact.mock';
import { googlePhoneNumberMock } from './mock/google-phone-number.mock';

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
      min: 999,
    }) * 1000000000,
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

  describe('/contact (POST)', () => {
    it('Should return status 403', async () => {
      await api
        .post('/contact')
        .send()
        .expect(({ status }) => {
          expect(status).toBe(403);
        });

      await api
        .post('/contact')
        .set('Authorization', faker.datatype.uuid())
        .send()
        .expect(({ status }) => {
          expect(status).toBe(403);
        });
    });

    for (const prefix of notValidPrefix) {
      it(`Should return status 400 and error VALIDATION_FAILED if prefix is ${prefix}`, async () => {
        await api
          .post('/contact')
          .set('Authorization', dataset.users[0].id)
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
        await api
          .post('/contact')
          .set('Authorization', dataset.users[0].id)
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
      const userId = dataset.users[0].id;

      await api
        .post('/contact')
        .set('Authorization', userId)
        .send({
          phone: getRandomPhoneNumber(),
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
        .set('Authorization', userId)
        .send({
          prefix: getRandomPhonePrefix(),
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
        .set('Authorization', userId)
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
        .post('/api/v2/contact')
        .set('Authorization', dataset.users[0].id)
        .send({
          prefix: faker.datatype.number(999),
          phone: faker.datatype.number(999999999999).toString(),
          name: faker.name.findName(),
          surname: faker.name.lastName(),
          active: true,
          email: faker.internet.email(),
        })
        .then(({ status, body }) => {
          expect(status).toBe(400);
          expect(body.error.code).toBe(VALIDATION_FAILED);
        });

      await api
        .post('/contact')
        .set('Authorization', userId)
        .send({
          name: faker.name.findName(),
          surname: faker.name.lastName(),
          active: true,
          email: faker.internet.email(),
        })
        .then((result) => {
          expect(result.status).toBe(201);
        });

      await api
        .post('/contact')
        .set('Authorization', userId)
        .send({
          name: faker.name.findName(),
          surname: faker.name.lastName(),
          active: true,
          phone: getRandomPhoneNumber(),
          prefix: getRandomPhonePrefix(),
        })
        .then((result) => {
          expect(result.status).toBe(201);
        });
    });

    it('Should return status 400 and error PHONE_NUMBER_IS_INVALID', async () => {
      jest
        .spyOn(googlePhoneNumberMock, 'isValidNumber')
        .mockImplementationOnce(jest.fn(() => false));

      await api
        .post('/api/v2/contact')
        .set('Authorization', dataset.users[0].id)
        .send({
          prefix: 48,
          phone: '111456789',
          countryCode: 'pl',
          name: faker.name.findName(),
          surname: faker.name.lastName(),
          active: true,
          email: faker.internet.email(),
        })
        .then(({ status, body }) => {
          expect(status).toBe(400);
          expect(body.error.code).toBe(PHONE_NUMBER_IS_INVALID);
        });
    });

    it('Should add contact, return status 201 and valid body', async () => {
      let body;

      ({ body } = await api
        .post('/contact')
        .set('Authorization', dataset.users[0].id)
        .send({
          prefix: faker.datatype.number(999),
          phone: faker.datatype.number(999999999999).toString(),
          name: faker.name.findName(),
          surname: faker.name.lastName(),
          active: true,
          email: faker.internet.email(),
        })
        .expect(async ({ status }) => {
          expect(status).toBe(201);
        }));

      const contact = await getContactById(body.id);

      expect(contact.id).toBe(body.id);

      body = await api
        .post('/api/v2/contact')
        .set('Authorization', dataset.users[0].id)
        .send({
          prefix: 48,
          phone: '654321123',
          countryCode: 'pl',
          name: faker.name.findName(),
          surname: faker.name.lastName(),
          active: true,
          email: faker.internet.email(),
        })
        .expect(async ({ status }) => {
          expect(status).toBe(201);
        });
    });
  });
});
