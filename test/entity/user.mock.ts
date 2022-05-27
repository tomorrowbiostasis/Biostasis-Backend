import * as faker from 'faker';
import * as moment from 'moment';
import { UserEntity } from '../../src/user/entity/user.entity';
import { getConnection } from 'typeorm';
import { IUserData } from '../interface/user-data.interface';
import { omit } from '../../src/common/helper/omit';

export const getUserStub = (data?: IUserData): UserEntity => {
  const user = new UserEntity();

  user.id = faker.datatype.uuid();
  user.email = data?.email ?? faker.internet.email();

  return user;
};

export const addUser = async (data?: IUserData): Promise<UserEntity> => {
  const user = getUserStub(data);

  return getConnection().getRepository(UserEntity).save(user);
};

export const getUserById = async (id: string): Promise<UserEntity> => {
  return getConnection()
    .getRepository(UserEntity)
    .findOne({ where: { id }, relations: ['profile'] });
};

export const checkUser = async (response: any) => {
  const userId = response.id;
  const userDB = await getUserById(userId);

  expect(
    omit(response, [
      'createdAt',
      'updatedAt',
      'dateOfBirth',
      'lastHospitalVisit',
      'fillLevel',
      'prefix',
      'isEmergencyTriggerActive',
    ])
  ).toEqual(
    omit(
      {
        ...userDB.profile,
        allowNotifications: userDB.profile.allowNotifications !== false,
        tipsAndTricks: userDB.profile.tipsAndTricks !== false,
        emergencyEmailAndSms: userDB.profile.emergencyEmailAndSms !== false,
        uploadedDocumentsAccess:
          userDB.profile.uploadedDocumentsAccess !== false,
        locationAccess: !!userDB.profile.locationAccess,
        readManual: !!userDB.profile.readManual,
        automatedEmergency: !!userDB.profile.automatedEmergency,
        regularPushNotification: !!userDB.profile.regularPushNotification,
        pulseBasedTriggerIOSHealthPermissions:
          !!userDB.profile.pulseBasedTriggerIOSHealthPermissions,
        pulseBasedTriggerIOSAppleWatchPaired:
          !!userDB.profile.pulseBasedTriggerIOSAppleWatchPaired,
        pulseBasedTriggerGoogleFitAuthenticated:
          !!userDB.profile.pulseBasedTriggerGoogleFitAuthenticated,
        pulseBasedTriggerConnectedToGoogleFit:
          !!userDB.profile.pulseBasedTriggerConnectedToGoogleFit,
        pulseBasedTriggerBackgroundModesEnabled:
          !!userDB.profile.pulseBasedTriggerBackgroundModesEnabled,
        ...userDB,
      },
      [
        'prefix',
        'createdAt',
        'updatedAt',
        'profile',
        'dateOfBirth',
        'lastHospitalVisit',
        'userId',
        'regularNotificationTime',
      ]
    )
  );

  expect(response.fillLevel).toBeDefined();

  if (response.prefix) {
    expect(response.prefix).toBe(Number(userDB.profile.prefix));
  }

  if (response.dateOfBirth) {
    expect(response.dateOfBirth).toBe(
      moment(userDB.profile.dateOfBirth).format('DD/MM/YYYY')
    );
  }

  if (response.lastHospitalVisit) {
    expect(response.lastHospitalVisit).toBe(
      moment(userDB.profile.lastHospitalVisit).format('DD/MM/YYYY')
    );
  }

  expect(response.createdAt).toBe(userDB.createdAt.toISOString());
  expect(response.updatedAt).toBe(userDB.updatedAt.toISOString());
};
