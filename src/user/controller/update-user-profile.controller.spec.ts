import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';
import { UpdateUserProfileController } from './update-user-profile.controller';
import { ProfileService } from '../service/profile.service';
import { profileServiceMock } from '../../../test/mock/profile.service.mock';
import { UnconfirmedEmailService } from '../service/unconfirmed-email.service';
import { unconfirmedEmailServiceMock } from '../../../test/mock/unconfirmed-email.service.mock';
import { NotificationService } from '../../notification/service/notification.service';
import { notificationServiceMock } from '../../../test/mock/notification.service.mock';
import { DICTIONARY } from '../../common/constant/dictionary.constant';
import { configMock } from '../../../test/mock/config.mock';
import { getUserStub } from '../../../test/entity/user.mock';
import { getProfileStub } from '../../../test/entity/profile.mock';
import { UpdateUserProfileDTO } from '../request/dto/update-user-profile.dto';
import { ProfileEntity } from '../entity/profile.entity';
import { googlePhoneNumberMock } from '../../../test/mock/google-phone-number.mock';
import { PositiveInfoService } from '../service/positive-info.service';
import { positiveInfoServiceMock } from '../../../test/mock/positive-info.service.mock';
import { UserService } from '../service/user.service';
import { userServiceMock } from '../../../test/mock/user.service.mock';

describe('Update User Profile Controller', () => {
  let controller: UpdateUserProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UpdateUserProfileController],
      providers: [
        {
          provide: ProfileService,
          useValue: profileServiceMock,
        },
        {
          provide: UnconfirmedEmailService,
          useValue: unconfirmedEmailServiceMock,
        },
        {
          provide: NotificationService,
          useValue: notificationServiceMock,
        },
        {
          provide: DICTIONARY.CONFIG,
          useValue: configMock,
        },
        {
          provide: DICTIONARY.GOOGLE_PHONE_NUMBER,
          useValue: googlePhoneNumberMock,
        },
        {
          provide: PositiveInfoService,
          useValue: positiveInfoServiceMock,
        },
        {
          provide: UserService,
          useValue: userServiceMock,
        },
      ],
    }).compile();

    controller = module.get<UpdateUserProfileController>(
      UpdateUserProfileController
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Is method defined', () => {
    it('updateUserProfile is defined', () =>
      expect(controller.updateUserProfile).toBeDefined());
    it('generateAndSendCodeConfirmingEmailChange is defined', () =>
      expect(
        controller.generateAndSendCodeConfirmingEmailChange
      ).toBeDefined());
  });

  describe('Check if methods work properly', () => {
    const user = getUserStub();
    const profile = getProfileStub({ userId: user.id });

    it('updateUserProfile() clears positive info if automatedEmergency flag has been changed', async () => {
      jest
        .spyOn(profileServiceMock, 'findByUserId')
        .mockReturnValue(new Promise((res) => res(profile)));

      await controller.updateUserProfile(
        user, 
        { automatedEmergency: !profile.automatedEmergency } as UpdateUserProfileDTO
      );

      const minutesToNext = profile.regularPushNotification
        ? null
        : profile.positiveInfoPeriod;

      expect(positiveInfoServiceMock.savePositiveInfo).toHaveBeenNthCalledWith(1, user.id, { minutesToNext });

      jest.clearAllMocks();
    });

    it('updateUserProfile() does call generateAndSendCodeConfirmingEmailChange()', async () => {
      let data = {
        email: faker.internet.email(),
      } as UpdateUserProfileDTO;
      const spyOnGenerateAndSendCodeConfirmingEmailChange = jest.spyOn(
        controller,
        'generateAndSendCodeConfirmingEmailChange'
      );

      jest
        .spyOn(profileServiceMock, 'findByUserId')
        .mockReturnValue(new Promise((res) => res(profile)));

      await controller.updateUserProfile(user, data);

      expect(spyOnGenerateAndSendCodeConfirmingEmailChange).toBeCalledWith(
        data,
        user,
        profile
      );

      jest.clearAllMocks();

      data = {
        name: faker.name.firstName(),
        surname: faker.name.lastName(),
      } as UpdateUserProfileDTO;

      await controller.updateUserProfile(user, data);

      expect(spyOnGenerateAndSendCodeConfirmingEmailChange).toBeCalledTimes(0);
    });

    it('generateAndSendCodeConfirmingEmailChange() does call NotificationService.sendEmail() with the expected parameters', async () => {
      let data = {
        name: faker.name.firstName(),
        surname: faker.name.lastName(),
        email: faker.internet.email(),
      } as UpdateUserProfileDTO;
      const url = faker.internet.url();
      const code = faker.datatype.uuid();

      jest.spyOn(configMock, 'get').mockReturnValue(url);

      jest
        .spyOn(unconfirmedEmailServiceMock, 'saveUnconfirmedEmail')
        .mockReturnValue(
          new Promise((res) =>
            res({
              code,
            })
          )
        );

      await controller.generateAndSendCodeConfirmingEmailChange(
        data,
        user,
        profile
      );

      expect(notificationServiceMock.prepareEmailData).toBeCalledWith(
        3051696,
        {
          username: `${data.name} ${data.surname}`,
          domain: url,
          code,
          email: data.email,
        },
        {},
        [
          {
            Email: user.email,
          },
        ]
      );

      data = {
        email: faker.internet.email(),
      } as UpdateUserProfileDTO;

      await controller.generateAndSendCodeConfirmingEmailChange(data, user, {
        ...profile,
        name: null,
        surname: null,
      } as ProfileEntity);

      expect(notificationServiceMock.prepareEmailData).toBeCalledWith(
        3051696,
        {
          username: user.email,
          domain: url,
          code,
          email: data.email,
        },
        {},
        [
          {
            Email: user.email,
          },
        ]
      );
    });
  });
});
