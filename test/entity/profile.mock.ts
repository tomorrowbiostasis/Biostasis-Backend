import * as moment from 'moment';
import { ProfileEntity } from '../../src/user/entity/profile.entity';
import { getConnection } from 'typeorm';
import { omit } from '../../src/common/helper/omit';

export const getProfileById = async (
  userId: string
): Promise<ProfileEntity> => {
  return getConnection()
    .getRepository(ProfileEntity)
    .findOne({ where: { userId }, relations: ['user'] });
};

export const checkProfile = async (response: any) => {
  const userId = response.userId;
  const profileDB = await getProfileById(userId);

  expect(
    omit(response, [
      'createdAt',
      'updatedAt',
      'dateOfBirth',
      'lastHospitalVisit',
    ])
  ).toEqual(
    omit({ ...profileDB, email: profileDB.user.email }, [
      'createdAt',
      'updatedAt',
      'contacts',
      'dateOfBirth',
      'lastHospitalVisit',
      'user',
      'id',
    ])
  );

  if (response.dateOfBirth) {
    expect(response.dateOfBirth).toBe(
      moment(profileDB.dateOfBirth).format('DD/MM/YYYY')
    );
  }

  if (response.lastHospitalVisit) {
    expect(response.lastHospitalVisit).toBe(
      moment(profileDB.lastHospitalVisit).format('DD/MM/YYYY')
    );
  }

  expect(response.createdAt).toBe(profileDB.createdAt.toISOString());
  expect(response.updatedAt).toBe(profileDB.updatedAt.toISOString());
};
