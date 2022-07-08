import { plainToClass } from 'class-transformer';
import { ProfileEntity } from '../entity/profile.entity';
import { ProfileRO } from '../response/profile.ro';
import { getProfileDefaultValues } from '../helper/get-profile-default-values';

export const profileMapper = (profile: ProfileEntity): ProfileRO => {
  return plainToClass(ProfileRO, {
    ...profile,
    ...getProfileDefaultValues(profile),
  });
};
