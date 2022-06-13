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
import { MessageInstance } from 'twilio/lib/rest/api/v2010/account/message';
import { MESSAGE_TYPE } from '../../message/enum/message-type.enum';
import * as Bull from 'bull';
import { MessageService } from '../../queue/service/message.service';
import { messageServiceMock } from '../../../test/mock/message.service.mock';
import { ExportService } from '../../user/service/export.service';
import { exportServiceMock } from '../../../test/mock/export.service.mock';
import { FileService } from '../../file/service/file.service';
import { FileRepository } from '../../file/repository/file.repository';
import { fileRepositoryMock } from '../../../test/mock/file.repository.mock';
import { fileServiceMock } from '../../../test/mock/file.service.mock';
import { PositiveInfoRepository } from '../../user/repository/positive-info.repository';
import { positiveInfoRepositoryMock } from '../../../test/mock/positive-info.repository.mock';

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
        {
          provide: MessageService,
          useValue: messageServiceMock,
        },
        {
          provide: ExportService,
          useValue: exportServiceMock,
        },

        {
          provide: FileService,
          useValue: fileServiceMock,
        },
        {
          provide: FileRepository,
          useValue: fileRepositoryMock,
        },
        {
          provide: PositiveInfoRepository,
          useValue: positiveInfoRepositoryMock,
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
    const smsPrefix = faker.lorem.sentence();

    user.profile = getProfileStub({
      userId: user.id,
      emergencyEmailAndSms: true,
      locationAccess: true,
    });

    it('sendEmergencyMessage() does call addJobToQueue()', async () => {
      const contact = {
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        email: faker.internet.email(),
        phone: getRandomPhoneNumber(),
      };
      const data = {
        locationUrl: faker.internet.url(),
        delayed: true,
        messageType: MESSAGE_TYPE.HEART_RATE_INVALID,
      };
      const spyOnPrepareSmsData = jest.spyOn(service, 'prepareSmsData');
      const spyOnPrepareEmailData = jest.spyOn(service, 'prepareEmailData');

      jest
        .spyOn(service, 'sendEmail')
        .mockReturnValue(new Promise((res) => res({} as Email.Response)));
      jest
        .spyOn(service, 'sendSms')
        .mockReturnValue(new Promise((res) => res({} as MessageInstance)));
      jest
        .spyOn(messageServiceMock, 'addJobToQueue')
        .mockReturnValue(new Promise((res) => res({} as Bull.Job)));
      jest.spyOn(configMock, 'get').mockReturnValueOnce(smsPrefix);

      await service.sendEmergencyMessage(contact, user, data);

      expect(spyOnPrepareSmsData).toBeCalledWith(
        contact.phone,
        `${smsPrefix} ${user.profile.emergencyMessage} ${data.locationUrl}`
      );

      expect(spyOnPrepareEmailData).toBeCalledWith(
        3057200,
        {
          contactName: contact.name,
          username: `${user.profile.name} ${user.profile.surname}`,
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

      expect(messageServiceMock.addJobToQueue).toBeCalledTimes(1);
      expect(service.sendEmail).toBeCalledTimes(0);
      expect(service.sendSms).toBeCalledTimes(0);
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
      jest
        .spyOn(service, 'sendSms')
        .mockReturnValue(new Promise((res) => res({} as MessageInstance)));
      jest.spyOn(configMock, 'get').mockReturnValueOnce(smsPrefix);

      const spyOnPrepareSmsData = jest.spyOn(service, 'prepareSmsData');
      const spyOnPrepareEmailData = jest.spyOn(service, 'prepareEmailData');

      await service.sendEmergencyMessage(contact, user, data);

      expect(spyOnPrepareSmsData).toBeCalledWith(
        contact.phone,
        `${smsPrefix} ${user.profile.emergencyMessage} ${data.locationUrl}`
      );

      expect(spyOnPrepareEmailData).toBeCalledWith(
        3057200,
        {
          contactName: contact.name,
          username: `${user.profile.name} ${user.profile.surname}`,
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

      expect(service.sendEmail).toBeCalledTimes(1);
      expect(service.sendSms).toBeCalledTimes(1);

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

      expect(spyOnPrepareEmailData).toBeCalledWith(
        3057128,
        {
          contactName: contact.name,
          username: `${user.profile.name} ${user.profile.surname}`,
          message: user.profile.emergencyMessage,
        },
        {},
        [
          {
            Email: contact.email,
          },
        ]
      );

      expect(service.sendEmail).toBeCalledTimes(1);
      expect(service.sendSms).toBeCalledTimes(1);
    });
  });
});
