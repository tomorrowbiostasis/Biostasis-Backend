import { plainToClass } from 'class-transformer';
import { ProfileEntity } from '../entity/profile.entity';
import { ProfileRO } from '../response/profile.ro';

export const profileMapper = (profile: ProfileEntity): ProfileRO => {
  return plainToClass(ProfileRO, {
    ...profile,
    email: profile.user.email,
  });
};
