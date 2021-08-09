import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';
import { NotificationService } from './notification.service';
import { DICTIONARY } from '../../common/constant/dictionary.constant';
import { mailJetMock } from '../../../test/mock/mailjet.mock';
import { configMock } from '../../../test/mock/config.mock';
import { DICTIONARY as NOTIFICATION_DI } from '../constant/dictionary.constant';
import * as twilioLibrary from 'twilio';
import { twilioMock } from '../../../test/mock/twilio.mock';
import { getUserStub } from '../../../test/entity/user.mock';
import { getProfileStub } from '../../../test/entity/profile.mock';
import { SendTestMessageDTO } from '../../user/request/dto/send-test-message.dto';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: NOTIFICATION_DI.MAIL_JET,
          useValue: mailJetMock,
        },
        {
          provide: DICTIONARY.CONFIG,
          useValue: configMock,
        },
        {
          provide: twilioLibrary.Twilio,
          useValue: twilioMock,
        },
      ],
    }).compile();

    service = app.get<NotificationService>(NotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Is method defined', () => {
    it('sendEmergencyMessage is defined', () =>
      expect(service.sendEmergencyMessage).toBeDefined());
  });

  describe('Check if methods work properly', () => {
    const user = getUserStub();

    user.profile = getProfileStub({
      userId: user.id,
      emergencyEmailAndSms: true,
      locationAccess: true,
    });

    it('sendEmergencyMessage() does call sendEmail() and sendSms() with the expected parameters', async () => {
      const contact = {
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        email: faker.internet.email(),
      };
      const data = {
        locationUrl: faker.internet.url(),
      };

      const spyOnSendSms = jest.spyOn(service, 'sendSms');
      const spyOnSendEmail = jest.spyOn(service, 'sendEmail');

      await service.sendEmergencyMessage(contact, user, data);

      expect(spyOnSendSms).toBeCalledWith(
        `${user.profile.prefix}${user.profile.phone}`,
        `${user.profile.emergencyMessage} ${data.locationUrl}`
      );

      expect(spyOnSendEmail).toBeCalledWith(
        3057200,
        {
          contactName: contact.name,
          userName: `${user.profile.name} ${user.profile.surname}`,
          message: user.profile.emergencyMessage,
          locationUrl: data.locationUrl,
        },
        {},
        [
          {
            Email: contact.email,
          },
        ]
      );

      jest.clearAllMocks();

      await service.sendEmergencyMessage(
        contact,
        {
          ...user,
          profile: {
            ...user.profile,
            locationAccess: false,
          },
        },
        {} as SendTestMessageDTO
      );

      expect(spyOnSendEmail).toBeCalledWith(
        3057128,
        {
          contactName: contact.name,
          userName: `${user.profile.name} ${user.profile.surname}`,
          message: user.profile.emergencyMessage,
        },
        {},
        [
          {
            Email: contact.email,
          },
        ]
      );
    });

    it('sendEmergencyMessage() does not call sendSms() fo test message', async () => {
      jest.clearAllMocks();

      const spyOnSendSms = jest.spyOn(service, 'sendSms');
      const spyOnSendEmail = jest.spyOn(service, 'sendEmail');
      const data = {
        locationUrl: faker.internet.url(),
      };
      const contact = {
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        email: user.email,
      };

      await service.sendEmergencyMessage(contact, user, data);

      expect(spyOnSendEmail).toBeCalledTimes(1);
      expect(spyOnSendSms).toBeCalledTimes(0);
    });
  });
});
