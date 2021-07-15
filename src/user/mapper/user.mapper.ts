import { plainToClass } from 'class-transformer';
import { UserEntity } from '../entity/user.entity';
import { UserRO } from '../response/user.ro';
import { isDefined } from '../../common/helper/is-defined';
import { match } from 'assert';

export enum PROFILE_WEIGHT {
  name = 1,
  surname = 1,
  prefix = 1,
  phone = 1,
  address = 1,
  dateOfBirth = 1,
  primaryPhisican = 1,
  primaryPhisicanAddress = 1,
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
      (!user?.profile?.seriousMedicalIssues &&
        ['mostRecentDiagnosis', 'lastHospitalVisit'].includes(key))
    ) {
      weightOfValues += Number(value);
    }
  }

  return (weightOfValues / sumOfWeights) * 100;
};

export const userMapper = (user: UserEntity): UserRO => {
  return plainToClass(UserRO, {
    ...user.profile,
    ...user,
    fillLevel: Math.round(calculatePercentByWeight(user)),
  });
};
