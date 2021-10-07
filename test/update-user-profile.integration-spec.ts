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
import { checkProfile } from './entity/profile.mock';
import { addUser } from './entity/user.mock';

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

  describe('/user (PATCH)', () => {
    it('Should return status 403', async () => {
      return api
        .patch('/user')
        .send()
        .expect(({ status }) => {
          expect(status).toBe(403);
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
          positiveInfoPeriod: 721,
        })
        .then(({ status, body }) => {
          expect(status).toBe(400);
          expect(body.error.code).toBe(VALIDATION_FAILED);
        });

      await api
        .patch('/api/v2/user')
        .set('Authorization', dataset.user.id)
        .send({
          positiveInfoPeriod: 9,
        })
        .then(({ status, body }) => {
          expect(status).toBe(400);
          expect(body.error.code).toBe(VALIDATION_FAILED);
        });
    });

    it('Should return status 400 and error PHONE_NUMBER_IS_INVALID', async () => {
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
      const data = {
        prefix: getRandomPhonePrefix(),
        phone: getRandomPhoneNumber(),
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
        automatedVoiceCall: true,
        locationAccess: true,
        uploadedDocumentsAccess: true,
        readManual: true,
        automatedEmergency: true,
        emergencyMessage: faker.lorem.sentence(),
        regularPushNotification: true,
        frequencyOfRegularNotification: 720,
        positiveInfoPeriod: 10,
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
      expect(body.prefix).toBe(data.prefix);
      expect(body.phone).toBe(data.phone);
      expect(body.primaryPhysician).toBe(data.primaryPhysician);
      expect(body.primaryPhysicianAddress).toBe(data.primaryPhysicianAddress);
      expect(body.seriousMedicalIssues).toBe(data.seriousMedicalIssues);
      expect(body.mostRecentDiagnosis).toBe(data.mostRecentDiagnosis);
      expect(body.lastHospitalVisit).toBe(data.lastHospitalVisit);
      expect(body.allowNotifications).toBe(data.allowNotifications);
      expect(body.tipsAndTricks).toBe(data.tipsAndTricks);
      expect(body.emergencyEmailAndSms).toBe(data.emergencyEmailAndSms);
      expect(body.automatedVoiceCall).toBe(data.automatedVoiceCall);
      expect(body.locationAccess).toBe(data.locationAccess);
      expect(body.uploadedDocumentsAccess).toBe(data.uploadedDocumentsAccess);
      expect(body.readManual).toBe(data.readManual);
      expect(body.automatedEmergency).toBe(data.automatedEmergency);
      expect(body.emergencyMessage).toBe(data.emergencyMessage);
      expect(body.regularPushNotification).toBe(data.regularPushNotification);
      expect(body.frequencyOfRegularNotification).toBe(
        data.frequencyOfRegularNotification
      );
      expect(body.positiveInfoPeriod).toBe(data.positiveInfoPeriod);

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

      expect(body.prefix).toBe(prefix);
      expect(body.phone).toBe(phone.toString());

      const user = await addUser();
      const randomName = faker.name.firstName();

      ({ body } = await api
        .patch('/user')
        .set('Authorization', user.id)
        .send({ name: randomName, seriousMedicalIssues: false, prefix, phone })
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
