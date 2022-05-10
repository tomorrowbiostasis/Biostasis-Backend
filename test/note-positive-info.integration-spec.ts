import * as superTest from "supertest";
import { clearDatabase } from "./helper";
import { getTestApp } from "./mock/app.mock";
import { initializeDataset } from "./helper/user";
import * as faker from "faker";
import {
  VALIDATION_FAILED,
  SAVE_POSITIVE_INFO_FAILED,
  MINUTES_TO_NEXT_MESSAGE_ARE_REQUIRED,
} from "../src/common/error/keys";
import { getPositiveInfoByUserId } from "./entity/positive-info.mock";
import { PositiveInfoRepository } from "../src/user/repository/positive-info.repository";
import { addUser } from "./entity/user.mock";
import { addProfile } from "./entity/profile.mock";

describe("/user (integration) ", () => {
  let app;
  let api: superTest.SuperTest<superTest.Test>;
  let dataset: any;

  const notValidPeriod = [
    null,
    faker.datatype.boolean(),
    faker.datatype.string(201),
    5,
    2881,
  ];
  const notValidLocation = [
    faker.datatype.boolean(),
    faker.datatype.number(),
    faker.datatype.string(201),
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

  describe("/user/positive-info (PATCH)", () => {
    it("Should return status 403", async () => {
      await api
        .post("/user/positive-info")
        .send()
        .expect(({ status }) => {
          expect(status).toBe(403);
        });
    });

    for (const minutesToNext of notValidPeriod) {
      it(`Should return status 400 and error VALIDATION_FAILED if minutesToNext is ${minutesToNext}`, async () =>
        api
          .post("/user/positive-info")
          .set("Authorization", dataset.user.id)
          .send({
            minutesToNext,
          })
          .then((result) => {
            expect(result.status).toBe(400);
            expect(result.body.error.code).toBe(VALIDATION_FAILED);
          }));
    }

    it("Should return status 400 and error SAVE_POSITIVE_INFO_FAILED", async () => {
      const user = await addUser();

      user.profile = await addProfile({
        userId: user.id,
        automatedEmergency: true
      });

      jest
        .spyOn(PositiveInfoRepository.prototype, "save")
        .mockImplementationOnce(
          jest.fn(async () => {
            throw new Error();
          })
        );

      await api
        .post("/user/positive-info")
        .set("Authorization", user.id)
        .send({
          minutesToNext: 90,
        })
        .then(({ status, body }) => {
          expect(status).toBe(400);
          expect(body.error.code).toBe(SAVE_POSITIVE_INFO_FAILED);
        });
    });

    it("Should return status 400 and error MINUTES_TO_NEXT_MESSAGE_ARE_REQUIRED", async () => {
      await api
        .post("/user/positive-info")
        .set("Authorization", dataset.user.id)
        .send({})
        .then(({ status, body }) => {
          expect(status).toBe(400);
          expect(body.error.code).toBe(MINUTES_TO_NEXT_MESSAGE_ARE_REQUIRED);
        });
    });

    it("Should note positive info, return status 200 and valid body", async () => {
      const user2 = await addUser();

      user2.profile = await addProfile({
        userId: user2.id,
        automatedEmergency: true
      });
      
      let minutesToNext = 90;

      await api
        .post("/user/positive-info")
        .set("Authorization", user2.id)
        .send({ minutesToNext })
        .expect(({ status, body }) => {
          expect(status).toBe(201);
          expect(body.success).toBeTruthy();
        });

      const item = await getPositiveInfoByUserId(user2.id);

      expect(item.minutesToNext).toBe(minutesToNext);

      await api
        .post("/user/positive-info")
        .set("Authorization", user2.id)
        .send({ minutesToNext })
        .expect(({ status, body }) => {
          expect(status).toBe(201);
          expect(body.success).toBeTruthy();
        });

      let newItem = await getPositiveInfoByUserId(user2.id);

      expect(item.updatedAt).toBeDefined();
      expect(item.id).toBe(newItem.id);
      expect(item.updatedAt !== newItem.updatedAt).toBeTruthy();

      minutesToNext = 91;

      await api
        .post("/user/positive-info")
        .set("Authorization", user2.id)
        .send({ minutesToNext })
        .expect(({ status, body }) => {
          expect(status).toBe(201);
          expect(body.success).toBeTruthy();
        });

      newItem = await getPositiveInfoByUserId(user2.id);

      expect(item.id).toBe(newItem.id);
      expect(newItem.minutesToNext).toBe(minutesToNext);
    });
  });
});
