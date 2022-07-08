import * as superTest from "supertest";

import { clearDatabase } from "./helper";
import { getTestApp } from "./mock/app.mock";
import { initializeDataset } from "./helper/contact";
import { addUser } from "./entity/user.mock";
import { addProfile } from "./entity/profile.mock";
import { PositiveInfoRepository } from "../src/user/repository/positive-info.repository";
import { PositiveInfoEntity } from "../src/user/entity/positive-info.entity";

describe("Switching between Pulse Based and Time Based trigger", () => {
  const positiveInfoRepositorySaveSpy = jest.spyOn(
    PositiveInfoRepository.prototype,
    "save"
  );

  let app,
    api: superTest.SuperTest<superTest.Test>,
    dataset: any,
    positiveInfo: PositiveInfoEntity;

  beforeAll(async () => {
    app = await getTestApp();

    api = superTest(app.getHttpServer());

    await clearDatabase();

    dataset = await initializeDataset();

    positiveInfo = new PositiveInfoEntity();
    positiveInfo.id = 999;
    positiveInfo.createdAt = new Date("2022-05-05T09:59:35.000Z");
  });

  afterAll(async () => {
    await app.close();
  });

  test("proper switching from pulse to time based", async () => {
    const user = await addUser();

    user.profile = await addProfile({
      userId: user.id,
      regularPushNotification: false,
    });

    const now = new Date().toISOString();

    jest
      .spyOn(PositiveInfoRepository.prototype, "findByUserId")
      .mockResolvedValueOnce({ ...positiveInfo, now } as any);

    await api
      .patch("/api/v2/user")
      .set("Authorization", user.id)
      .send({
        regularPushNotification: true,
      })
      .then(({ status, body }) => {
        expect(status).toBe(200);
        expect(body.regularPushNotification).toBe(true);
      });

    expect(positiveInfoRepositorySaveSpy).toBeCalledWith({
      ...positiveInfo,
      userId: user.id,
      smsTime: null,
      pushNotificationTime: null,
      alertTime: null,
      triggerTime: null,
      updatedAt: now,
      now,
    });
  });

  test("proper switching from time to pulse based", async () => {
    const user = await addUser();

    user.profile = await addProfile({
      userId: user.id,
      regularPushNotification: true,
    });

    const now = new Date().toISOString();

    jest
      .spyOn(PositiveInfoRepository.prototype, "findByUserId")
      .mockResolvedValueOnce({ ...positiveInfo, now } as any);

    await api
      .patch("/api/v2/user")
      .set("Authorization", user.id)
      .send({
        regularPushNotification: false,
      })
      .then(({ status, body }) => {
        expect(status).toBe(200);
        expect(body.regularPushNotification).toBe(false);
      });

    expect(positiveInfoRepositorySaveSpy).toBeCalledWith({
      ...positiveInfo,
      userId: user.id,
      smsTime: null,
      pushNotificationTime: null,
      alertTime: null,
      triggerTime: null,
      updatedAt: now,
      now,
    });
  });
});
