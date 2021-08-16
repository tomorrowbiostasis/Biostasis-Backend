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
import { SendEmergencyMessageDTO } from '../../message/request/dto/send-emergency-message.dto';
import { getRandomPhoneNumber } from '../../../test/entity/contact.mock';
import { QUEUE } from '../../queue/constant/queue.constant';
import { queueServiceMock } from '../../../test/mock/queue.service.mock';
import { Email } from 'node-mailjet';

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
        {
          provide: QUEUE.MESSAGE,
          useValue: queueServiceMock,
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
        phone: getRandomPhoneNumber(),
      };
      const data = {
        locationUrl: faker.internet.url(),
      };

      jest
        .spyOn(service, 'sendEmail')
        .mockReturnValue(new Promise((res) => res({} as Email.Response)));

      const spyOnPrepareDataAndSendSms = jest.spyOn(
        service,
        'prepareDataAndSendSms'
      );
      const spyOnPrepareDataAndSendEmail = jest.spyOn(
        service,
        'prepareDataAndSendEmail'
      );

      await service.sendEmergencyMessage(contact, user, data);

      expect(spyOnPrepareDataAndSendSms).toBeCalledWith(
        contact.phone,
        `${user.profile.emergencyMessage} ${data.locationUrl}`
      );

      expect(spyOnPrepareDataAndSendEmail).toBeCalledWith(
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
        {} as SendEmergencyMessageDTO
      );

      expect(spyOnPrepareDataAndSendEmail).toBeCalledWith(
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

      jest
        .spyOn(service, 'sendEmail')
        .mockReturnValue(new Promise((res) => res({} as Email.Response)));

      const spyOnPrepareDataAndSendSms = jest.spyOn(
        service,
        'prepareDataAndSendSms'
      );
      const spyOnPrepareDataAndSendEmail = jest.spyOn(
        service,
        'prepareDataAndSendEmail'
      );
      const data = {
        locationUrl: faker.internet.url(),
      };
      const contact = {
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        email: user.email,
        phone: getRandomPhoneNumber(),
      };

      await service.sendEmergencyMessage(contact, user, data);

      expect(spyOnPrepareDataAndSendEmail).toBeCalledTimes(1);
      expect(spyOnPrepareDataAndSendSms).toBeCalledTimes(0);
    });
  });
});
