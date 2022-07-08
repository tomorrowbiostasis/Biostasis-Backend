import * as superTest from 'supertest';
import { clearDatabase } from './helper';
import { getTestApp } from './mock/app.mock';
import { initializeDataset } from './helper/user';
import * as faker from 'faker';
import {
  VALIDATION_FAILED,
  PHONE_NUMBER_IS_NEEDED,
} from '../src/common/error/keys';
import { MESSAGE_TYPE } from '../src/message/enum/message-type.enum';
import { addUser } from './entity/user.mock';
import { addProfile } from './entity/profile.mock';
import { twilioMock } from './mock/twilio.mock';
import * as uuid from 'uuid';

describe('/message (integration) ', () => {
  let app;
  let api: superTest.SuperTest<superTest.Test>;
  let dataset: any;

  const notValidMessageType = [
    null,
    undefined,
    faker.datatype.number(),
    faker.datatype.boolean(),
    faker.datatype.string(),
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

  describe('/message/send/sms (POST)', () => {
    it('Should return status 403', async () => {
      await api
        .post('/message/send/sms')
        .send()
        .expect(({ status }) => {
          expect(status).toBe(403);
        });

      await api
        .post('/message/send/sms')
        .set('Authorization', faker.datatype.uuid())
        .send()
        .expect(({ status }) => {
          expect(status).toBe(403);
        });
    });

    for (const messageType of notValidMessageType) {
      it(`Should return status 400 and error VALIDATION_FAILED if messageType is ${messageType}`, async () => {
        await api
          .post('/message/send/sms')
          .set('Authorization', dataset.user.id)
          .send({
            messageType,
          })
          .then(({ status, body }) => {
            expect(status).toBe(400);
            expect(body.error.code).toBe(VALIDATION_FAILED);
          });
      });
    }

    it('Should return status 400 and error PHONE_NUMBER_IS_NEEDED', async () => {
      let user = await addUser();

      await api
        .post('/message/send/sms')
        .set('Authorization', user.id)
        .send({
          messageType: MESSAGE_TYPE.HEART_RATE_INVALID,
        })
        .then(({ status, body }) => {
          expect(status).toBe(400);
          expect(body.error.code).toBe(PHONE_NUMBER_IS_NEEDED);
        });

      user.profile = await addProfile({
        userId: user.id,
        prefix: null,
      });

      await api
        .post('/message/send/sms')
        .set('Authorization', user.id)
        .send({
          messageType: MESSAGE_TYPE.HEART_RATE_INVALID,
        })
        .then(({ status, body }) => {
          expect(status).toBe(400);
          expect(body.error.code).toBe(PHONE_NUMBER_IS_NEEDED);
        });
    });

    it('Should send sms, return status 201 and valid body', async () => {
      await api
        .post('/message/send/sms')
        .set('Authorization', dataset.user.id)
        .send({
          messageType: MESSAGE_TYPE.HEART_RATE_INVALID,
        })
        .then(({ status, body }) => {
          expect(status).toBe(201);
          expect(body).toEqual({ success: true });
        });
    });

    it('Should does not send sms, return status 201 and valid body', async () => {
      jest.spyOn(twilioMock.messages, 'create').mockImplementationOnce(
        jest.fn(async () => ({
          sid: uuid.v4(),
          errorCode: faker.datatype.string(),
        }))
      );

      await api
        .post('/message/send/sms')
        .set('Authorization', dataset.user.id)
        .send({
          messageType: MESSAGE_TYPE.HEART_RATE_INVALID,
        })
        .then(({ status, body }) => {
          expect(status).toBe(201);
          expect(body).toEqual({ success: false });
        });
    });
  });
});
