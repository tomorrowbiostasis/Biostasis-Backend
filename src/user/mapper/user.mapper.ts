import { plainToClass } from 'class-transformer';
import { UserEntity } from '../entity/user.entity';
import { UserRO } from '../response/user.ro';
import { isDefined } from '../../common/helper/is-defined';
import { getProfileDefaultValues } from '../helper/get-profile-default-values';
import * as Bull from 'bull';

export enum PROFILE_WEIGHT {
  name = 1,
  surname = 1,
  prefix = 1,
  phone = 1,
  address = 1,
  dateOfBirth = 1,
  primaryPhysician = 1,
  primaryPhysicianAddress = 1,
  seriousMedicalIssues = 1,
  mostRecentDiagnosis = 1,
  lastHospitalVisit = 1,
}

const calculatePercentByWeight = (user: UserEntity): number => {
  let weightOfValues = 0;
  let sumOfWeights = 0;
  const weightList = Object.entries(PROFILE_WEIGHT).filter(([, value]) =>
    Number.isInteger(value)
  );

  for (const [key, value] of weightList) {
    sumOfWeights += Number(value);

    if (
      isDefined(user[key]) ||
      (user.profile && isDefined(user.profile[key])) ||
      (user?.profile?.seriousMedicalIssues !== true &&
        ['mostRecentDiagnosis', 'lastHospitalVisit'].includes(key)) ||
      (user?.profile?.regularPushNotification !== true &&
        key === 'frequencyOfRegularNotification') ||
      (user?.profile?.regularPushNotification === true &&
        key === 'positiveInfoPeriod')
    ) {
      weightOfValues += Number(value);
    }
  }

  return (weightOfValues / sumOfWeights) * 100;
};

export const userMapper = (user: UserEntity, trigger: Bull.Job): UserRO => {
  return plainToClass(UserRO, {
    ...user.profile,
    ...getProfileDefaultValues(user?.profile),
    ...user,
    fillLevel: Math.round(calculatePercentByWeight(user)),
    isEmergencyTriggerActive: trigger ? !!trigger : undefined,
  });
};
