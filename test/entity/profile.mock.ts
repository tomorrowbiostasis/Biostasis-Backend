import * as moment from "moment";
import * as faker from "faker";
import { ProfileEntity } from "../../src/user/entity/profile.entity";
import { getConnection, UpdateResult } from "typeorm";
import { omit } from "../../src/common/helper/omit";
import { IProfileData } from "../interface/profile-data.interface";
import { getRandomPhoneNumber, getRandomPhonePrefix } from "./contact.mock";
import { getUserById } from "../entity/user.mock";

export const getProfileStub = (data: IProfileData): ProfileEntity => {
  const profile = new ProfileEntity();

  profile.userId = data.userId;
  profile.name = data?.name ?? faker.name.firstName();
  profile.surname = data?.surname ?? faker.name.lastName();
  profile.prefix =
    data?.prefix !== undefined ? data.prefix : getRandomPhonePrefix();
  profile.location = data?.location;
  profile.phone =
    data?.phone !== undefined ? data.phone : getRandomPhoneNumber();
  profile.emergencyMessage = data?.emergencyMessage ?? faker.lorem.sentence();
  profile.address =
    data?.address ??
    `${faker.address.streetName()}, ${faker.address.city()}, ${faker.address.country()}`;
  profile.dateOfBirth = data?.dateOfBirth ?? moment().toDate();
  profile.primaryPhysician =
    data?.primaryPhysician ??
    `${faker.name.firstName()} ${faker.name.lastName()}`;
  profile.primaryPhysicianAddress =
    data?.primaryPhysicianAddress ??
    `${faker.address.streetName()}, ${faker.address.city()}, ${faker.address.country()}`;
  profile.seriousMedicalIssues =
    data?.seriousMedicalIssues !== undefined
      ? data.seriousMedicalIssues
      : faker.datatype.boolean();
  profile.mostRecentDiagnosis =
    data?.mostRecentDiagnosis !== undefined
      ? data.mostRecentDiagnosis
      : faker.lorem.sentence();
  profile.lastHospitalVisit =
    data.lastHospitalVisit !== undefined
      ? data.lastHospitalVisit
      : moment().toDate();
  profile.emergencyEmailAndSms =
    data?.emergencyEmailAndSms !== undefined
      ? data.emergencyEmailAndSms
      : faker.datatype.boolean();
  profile.locationAccess =
    data?.locationAccess !== undefined
      ? data.locationAccess
      : faker.datatype.boolean();
  profile.readManual =
    data?.readManual !== undefined ? data.readManual : faker.datatype.boolean();
  profile.automatedEmergency =
    data?.automatedEmergency !== undefined
      ? data.automatedEmergency
      : faker.datatype.boolean();
  profile.positiveInfoPeriod = data?.positiveInfoPeriod;
  profile.frequencyOfRegularNotification = data?.frequencyOfRegularNotification;
  profile.regularPushNotification = data?.regularPushNotification;

  return profile;
};

export const addProfile = async (
  data?: IProfileData
): Promise<ProfileEntity> => {
  const profile = getProfileStub(data);

  return getConnection().getRepository(ProfileEntity).save(profile);
};

export const getProfileById = async (
  userId: string
): Promise<ProfileEntity> => {
  return getConnection()
    .getRepository(ProfileEntity)
    .findOne({ where: { userId }, relations: ["user"] });
};

export const updateProfile = async (
  id: number,
  data: {
    emergencyEmailAndSms?: boolean;
  }
): Promise<UpdateResult> => {
  return getConnection().getRepository(ProfileEntity).update(id, data);
};

export const checkProfile = async (response: any) => {
  const userId = response.userId;
  const profileDB = await getProfileById(userId);
  const userDB = await getUserById(userId);

  expect(
    omit(response, [
      "createdAt",
      "updatedAt",
      "dateOfBirth",
      "lastHospitalVisit",
      "deviceId",
    ])
  ).toEqual(
    omit(
      {
        ...profileDB,
        prefix: Number(profileDB.prefix),
      },
      [
        "createdAt",
        "updatedAt",
        "contacts",
        "dateOfBirth",
        "lastHospitalVisit",
        "regularNotificationTime",
        "user",
        "id",
      ]
    )
  );

  if (response.deviceId) {
    expect(response.deviceId).toBe(userDB.deviceId);
  }

  if (response.dateOfBirth) {
    expect(response.dateOfBirth).toBe(
      moment(profileDB.dateOfBirth).format("DD/MM/YYYY")
    );
  }

  if (response.lastHospitalVisit) {
    expect(response.lastHospitalVisit).toBe(
      moment(profileDB.lastHospitalVisit).format("DD/MM/YYYY")
    );
  }

  expect(response.createdAt).toBe(profileDB.createdAt.toISOString());
  expect(response.updatedAt).toBe(profileDB.updatedAt.toISOString());
};
