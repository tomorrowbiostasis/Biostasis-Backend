import * as superTest from "supertest";
import { clearDatabase } from "./helper";
import { getTestApp } from "./mock/app.mock";
import { initializeDataset } from "./helper/message";
import * as faker from "faker";
import {
  VALIDATION_FAILED,
  EMAIL_AND_SMS_NOT_ALLOWED,
  TIME_SLOT_IS_UNAVAILABLE,
} from "../src/common/error/keys";
import { MESSAGE_TYPE } from "../src/message/enum/message-type.enum";
import { addUser } from "./entity/user.mock";
import { addProfile } from "./entity/profile.mock";
import { addContact } from "./entity/contact.mock";
import { TimeSlotRepository } from "../src/trigger-time-slot/repository/time-slot.repository";
import { TimeSlotEntity } from "../src/trigger-time-slot/entity/time-slot.entity";

describe("/message (integration) ", () => {
  let app;
  let api: superTest.SuperTest<superTest.Test>;
  let dataset: any;

  const notValidUrlValue = [
    faker.datatype.boolean(),
    faker.datatype.number(),
    null,
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

  describe("/message/send/emergency (POST)", () => {
    it("Should return status 403", async () => {
      await api
        .post("/message/send/emergency")
        .send()
        .expect(({ status }) => {
          expect(status).toBe(403);
        });

      await api
        .post("/message/send/emergency")
        .set("Authorization", faker.datatype.uuid())
        .send()
        .expect(({ status }) => {
          expect(status).toBe(403);
        });
    });

    it("Should return status 400 and error VALIDATION_FAILED for invalid dataset", async () => {
      await api
        .post("/message/send/emergency")
        .set("Authorization", dataset.user.id)
        .send({ delayed: faker.datatype.string() })
        .then(({ status, body }) => {
          expect(status).toBe(400);
          expect(body.error.code).toBe(VALIDATION_FAILED);
        });

      await api
        .post("/message/send/emergency")
        .set("Authorization", dataset.user.id)
        .send({
          messageType: faker.datatype.string(),
        })
        .then(({ status, body }) => {
          expect(status).toBe(400);
          expect(body.error.code).toBe(VALIDATION_FAILED);
        });
    });

    it("Should return status 400 and error EMAIL_AND_SMS_NOT_ALLOWED for invalid dataset", async () => {
      const user = await addUser();
      user.profile = await addProfile({
        userId: user.id,
        emergencyEmailAndSms: false,
        location: faker.internet.url(),
      });

      await addContact({
        userId: user.id,
        active: true,
      });

      await api
        .post("/message/send/emergency")
        .set("Authorization", user.id)
        .send({
          delayed: true,
          messageType: MESSAGE_TYPE.HEART_RATE_INVALID,
        })
        .then((result) => {
          expect(result.status).toBe(400);
          expect(result.body.error.code).toBe(EMAIL_AND_SMS_NOT_ALLOWED);
        });
    });

    it('Should send sms, return status 201 and key "success" with value false', async () => {
      const user = await addUser();
      user.profile = await addProfile({
        userId: user.id,
        emergencyEmailAndSms: false,
        location: faker.internet.url(),
      });

      await api
        .post("/message/send/emergency")
        .set("Authorization", user.id)
        .send({
          delayed: true,
          messageType: MESSAGE_TYPE.HEART_RATE_INVALID,
        })
        .then(({ status, body }) => {
          expect(status).toBe(201);
          expect(body).toEqual({ success: false });
        });

      await api
        .post("/message/send/emergency")
        .set("Authorization", user.id)
        .send({})
        .then(({ status, body }) => {
          expect(status).toBe(201);
          expect(body).toEqual({ success: false });
        });

      await addContact({
        userId: user.id,
        active: false,
      });

      await api
        .post("/message/send/emergency")
        .set("Authorization", user.id)
        .send({
          delayed: false,
        })
        .then(({ status, body }) => {
          expect(status).toBe(201);
          expect(body).toEqual({ success: false });
        });
    });

    it('Should send sms, return status 201 and key "success" with value true', async () => {
      await api
        .post("/message/send/emergency")
        .set("Authorization", dataset.user.id)
        .send({ delayed: false })
        .then(({ status, body }) => {
          expect(status).toBe(201);
          expect(body).toEqual({ success: true });
        });
    });
  });
});
