import * as superTest from 'supertest';
import * as moment from 'moment';
import { clearDatabase } from './helper';
import { getTestApp } from './mock/app.mock';
import { initializeDataset } from './helper/user';
import * as faker from 'faker';
import {
  VALIDATION_FAILED,
  PHONE_NUMBER_IS_INVALID,
} from '../src/common/error/keys';
import {
  getRandomPhoneNumber,
  getRandomPhonePrefix,
} from './entity/contact.mock';
import { checkUser } from './entity/user.mock';
import { addUser } from './entity/user.mock';
import { googlePhoneNumberMock } from './mock/google-phone-number.mock';

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

  describe('/api/v2/user (PATCH)', () => {
    it('Should return status 403', async () => {
      await api
        .patch('/api/v2/user')
        .send()
        .expect(({ status }) => {
          expect(status).toBe(403);
        });
    });

    it('Should return status 400 and error VALIDATION_FAILED for invalid dataset', async () => {
      await api
        .patch('/api/v2/user')
        .set('Authorization', dataset.user.id)
        .send({
          prefix: getRandomPhonePrefix(),
          phone: getRandomPhoneNumber(),
        })
        .then(({ status, body }) => {
          expect(status).toBe(400);
          expect(body.error.code).toBe(VALIDATION_FAILED);
        });

      await api
        .patch('/api/v2/user')
        .set('Authorization', dataset.user.id)
        .send({
          dateOfBirth: moment().add(1, 'days').format('DD/MM/YYYY'),
        })
        .then(({ status, body }) => {
          expect(status).toBe(400);
          expect(body.error.code).toBe(VALIDATION_FAILED);
        });

      await api
        .patch('/api/v2/user')
        .set('Authorization', dataset.user.id)
        .send({
          lastHospitalVisit: moment().add(1, 'days').format('DD/MM/YYYY'),
        })
        .then(({ status, body }) => {
          expect(status).toBe(400);
          expect(body.error.code).toBe(VALIDATION_FAILED);
        });

      await api
        .patch('/api/v2/user')
        .set('Authorization', dataset.user.id)
        .send({
          positiveInfoPeriod: 2881,
        })
        .then(({ status, body }) => {
          expect(status).toBe(400);
          expect(body.error.code).toBe(VALIDATION_FAILED);
        });

      await api
        .patch('/api/v2/user')
        .set('Authorization', dataset.user.id)
        .send({
          positiveInfoPeriod: 5,
        })
        .then(({ status, body }) => {
          expect(status).toBe(400);
          expect(body.error.code).toBe(VALIDATION_FAILED);
        });
    });

    it('Should return status 400 and error PHONE_NUMBER_IS_INVALID', async () => {
      jest
        .spyOn(googlePhoneNumberMock, 'isValidNumber')
        .mockImplementationOnce(jest.fn(() => false));

      await api
        .patch('/api/v2/user')
        .set('Authorization', dataset.user.id)
        .send({
          prefix: 48,
          phone: '111456789',
          countryCode: 'pl',
        })
        .then(({ status, body }) => {
          expect(status).toBe(400);
          expect(body.error.code).toBe(PHONE_NUMBER_IS_INVALID);
        });
    });

    it('Should update user profile, return status 200 and valid body', async () => {
      const location = faker.internet.url();

      const data = {
        prefix: getRandomPhonePrefix(),
        phone: getRandomPhoneNumber(),
        countryCode: faker.datatype.string(2),
        name: faker.name.findName(),
        surname: faker.name.lastName(),
        address: `${faker.address.streetName()}, ${faker.address.city()}, ${faker.address.country()}`,
        dateOfBirth: moment().format('DD/MM/YYYY'),
        primaryPhysician: `${faker.name.firstName()} ${faker.name.lastName()}`,
        primaryPhysicianAddress: `${faker.address.streetName()}, ${faker.address.city()}, ${faker.address.country()}`,
        seriousMedicalIssues: true,
        mostRecentDiagnosis: faker.lorem.sentence(),
        lastHospitalVisit: moment().subtract(2, 'days').format('DD/MM/YYYY'),
        allowNotifications: true,
        tipsAndTricks: true,
        emergencyEmailAndSms: true,
        locationAccess: true,
        location,
        uploadedDocumentsAccess: true,
        readManual: true,
        automatedEmergency: true,
        emergencyMessage: faker.lorem.sentence(),
        regularPushNotification: true,
        frequencyOfRegularNotification: 720,
        positiveInfoPeriod: 10,
        pulseBasedTriggerIOSHealthPermissions: true,
        pulseBasedTriggerIOSAppleWatchPaired: true,
        pulseBasedTriggerGoogleFitAuthenticated: true,
        pulseBasedTriggerConnectedToGoogleFit: true,
        pulseBasedTriggerBackgroundModesEnabled: true,
      };

      jest
        .spyOn(googlePhoneNumberMock, 'isValidNumber')
        .mockImplementationOnce(jest.fn(() => true));

      let { body } = await api
        .patch('/api/v2/user')
        .set('Authorization', dataset.user.id)
        .send(data)
        .expect(async ({ status }) => {
          expect(status).toBe(200);
        });

      await checkUser(body);

      expect(body.id).toBe(dataset.user.id);

      await api
        .patch('/api/v2/user')
        .set('Authorization', dataset.user.id)
        .send()
        .expect(async ({ status }) => {
          expect(status).toBe(200);
        });

      const prefix = getRandomPhonePrefix();
      const phone = getRandomPhoneNumber();

      ({ body } = await api
        .patch('/api/v2/user')
        .set('Authorization', dataset.user.id)
        .send({ prefix, phone, countryCode: faker.datatype.string(2) })
        .expect(async ({ status }) => {
          expect(status).toBe(200);
        }));

      expect(body.prefix).toBe(prefix);
      expect(body.phone).toBe(phone.toString());

      const user = await addUser();
      const randomName = faker.name.firstName();

      ({ body } = await api
        .patch('/api/v2/user')
        .set('Authorization', user.id)
        .send({
          name: randomName,
          seriousMedicalIssues: false,
          prefix,
          phone,
          countryCode: faker.datatype.string(2),
        })
        .expect(async ({ status }) => {
          expect(status).toBe(200);
        }));

      ({ body } = await api
        .get('/user')
        .set('Authorization', user.id)
        .send()
        .expect(async ({ status }) => {
          expect(status).toBe(200);
        }));

      expect(body.name).toBe(randomName);
      expect(body.seriousMedicalIssues).toBe(false);
      expect(body.prefix).toBe(prefix);
      expect(body.phone).toBe(phone);

      ({ body } = await api
        .patch('/api/v2/user')
        .set('Authorization', user.id)
        .send({ prefix: 48, phone: '654321123', countryCode: 'pl' })
        .expect(async ({ status }) => {
          expect(status).toBe(200);
        }));

      ({ body } = await api
        .patch('/api/v2/user')
        .set('Authorization', user.id)
        .send({ mostRecentDiagnosis: '', lastHospitalVisit: null })
        .expect(async ({ status }) => {
          expect(status).toBe(200);
        }));

      ({ body } = await api
        .patch('/api/v2/user')
        .set('Authorization', user.id)
        .send({ mostRecentDiagnosis: null, lastHospitalVisit: null })
        .expect(async ({ status }) => {
          expect(status).toBe(200);
        }));
    });
  });
});
