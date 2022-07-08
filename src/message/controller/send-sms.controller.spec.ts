import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';
import { SendSMSController } from './send-sms.controller';
import { ProfileService } from '../../user/service/profile.service';
import { NotificationService } from '../../notification/service/notification.service';
import { profileServiceMock } from '../../../test/mock/profile.service.mock';
import { notificationServiceMock } from '../../../test/mock/notification.service.mock';
import { DICTIONARY } from '../../common/constant/dictionary.constant';
import { configMock } from '../../../test/mock/config.mock';
import { getUserStub } from '../../../test/entity/user.mock';
import { getProfileStub } from '../../../test/entity/profile.mock';
import { MESSAGE_TYPE } from '../enum/message-type.enum';
import { getRandomPhoneNumber } from '../../../test/entity/contact.mock';

describe('Send SMS Controller', () => {
  let controller: SendSMSController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SendSMSController],
      providers: [
        {
          provide: ProfileService,
          useValue: profileServiceMock,
        },
        {
          provide: NotificationService,
          useValue: notificationServiceMock,
        },
        {
          provide: DICTIONARY.CONFIG,
          useValue: configMock,
        },
      ],
    }).compile();

    controller = module.get<SendSMSController>(SendSMSController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Is method defined', () => {
    it('sendSms is defined', () => expect(controller.sendSms).toBeDefined());
  });

  describe('Check if methods work properly', () => {
    const user = getUserStub();

    user.profile = getProfileStub({
      userId: user.id,
      emergencyEmailAndSms: true,
      locationAccess: true,
    });

    it('sendSms() does call sendSms() with the expected parameters', async () => {
      const messageType = faker.datatype.string();
      const sender = getRandomPhoneNumber();
      const recipient = `${user.profile.prefix}${user.profile.phone}`;

      jest
        .spyOn(profileServiceMock, 'findByUserId')
        .mockReturnValue(new Promise((res) => res(user.profile)));

      const messages = new Map([
        [MESSAGE_TYPE.HEART_RATE_INVALID, 'Your hear rate is invalid.'],
        [
          MESSAGE_TYPE.NO_CONNECTION_TO_WATCH,
          'We have detected no connection with your watch.',
        ],
      ]);

      for (const messageType of Object.values(MESSAGE_TYPE)) {
        jest
          .spyOn(configMock, 'get')
          .mockReturnValueOnce(messages.get(messageType));
        jest
          .spyOn(notificationServiceMock, 'prepareSmsData')
          .mockReturnValueOnce({
            from: sender,
            to: recipient,
            body: messages.get(messageType),
          });

        await controller.sendSms(user, {
          messageType,
        });

        expect(notificationServiceMock.prepareSmsData).toBeCalledWith(
          recipient,
          messages.get(messageType)
        );

        expect(notificationServiceMock.sendSms).toBeCalledWith({
          data: {
            from: sender,
            to: recipient,
            body: messages.get(messageType),
          },
        });
      }
    });
  });
});
