import { Test, TestingModule } from "@nestjs/testing";
import * as faker from "faker";
import { SendEmergencyMessageController } from "./send-emergency-message.controller";
import { UserService } from "../../user/service/user.service";
import { NotificationService } from "../../notification/service/notification.service";
import { userServiceMock } from "../../../test/mock/user.service.mock";
import { notificationServiceMock } from "../../../test/mock/notification.service.mock";
import { getUserStub } from "../../../test/entity/user.mock";
import { getProfileStub } from "../../../test/entity/profile.mock";
import { ContactService } from "../../contact/service/contact.service";
import { contactServiceMock } from "../../../test/mock/contact.service.mock";
import { getContactStub } from "../../../test/entity/contact.mock";
import { MESSAGE_TYPE } from "../../../src/message/enum/message-type.enum";
import { triggerTimeSlotServiceMock } from "../../../test/mock/trigger-time-slot.service.mock";

describe("Send Emergency Message Controller", () => {
  let controller: SendEmergencyMessageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SendEmergencyMessageController],
      providers: [
        {
          provide: UserService,
          useValue: userServiceMock,
        },
        {
          provide: NotificationService,
          useValue: notificationServiceMock,
        },
        {
          provide: ContactService,
          useValue: contactServiceMock,
        },
      ],
    }).compile();

    controller = module.get<SendEmergencyMessageController>(
      SendEmergencyMessageController
    );
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("Is method defined", () => {
    it("sendSms is defined", () =>
      expect(controller.sendEmergencyMessage).toBeDefined());
  });

  describe("Check if methods work properly", () => {
    const user = getUserStub();
    const contacts = [
      getContactStub({ userId: user.id, active: true }),
      getContactStub({ userId: user.id, active: true }),
    ];

    user.profile = getProfileStub({
      userId: user.id,
      emergencyEmailAndSms: true,
      locationAccess: true,
      location: faker.internet.url(),
    });

    it("sendEmergencyMessage() does call sendEmergencyMessage() with the expected parameters", async () => {
      const data = {
        delayed: true,
        messageType: MESSAGE_TYPE.HEART_RATE_INVALID,
      };

      jest
        .spyOn(userServiceMock, "findByIdOrFail")
        .mockReturnValue(new Promise((res) => res(user)));
      jest
        .spyOn(contactServiceMock, "findActiveContactsByUserId")
        .mockReturnValue(new Promise((res) => res(contacts)));
      jest
        .spyOn(triggerTimeSlotServiceMock, "isActiveTimeSlot")
        .mockReturnValue(new Promise((res) => res(false)));

      await controller.sendEmergencyMessage(user, data);

      expect(notificationServiceMock.sendEmergencyMessage).toBeCalledTimes(2);

      for (const contact of contacts) {
        expect(notificationServiceMock.sendEmergencyMessage).toBeCalledWith(
          {
            name: `${contact.name} ${contact.surname}`,
            email: contact.email,
            phone: contact.prefix ? `${contact.prefix}${contact.phone}` : null,
          },
          user,
          {
            ...data,
            locationUrl: user.profile.location,
          }
        );
      }
    });
  });
});
