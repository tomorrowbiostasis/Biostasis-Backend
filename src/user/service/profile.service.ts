import { Inject, Injectable } from '@nestjs/common';
import { ProfileRepository } from '../repository/profile.repository';
import { ProfileEntity } from '../entity/profile.entity';
import { CustomError } from '../../common/error/custom-error';
import { SAVE_PROFILE_FAILED } from '../../common/error/keys';
import { UpdateResult } from 'typeorm';
import { UpdateUserProfileDTO } from '../request/dto/update-user-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @Inject(ProfileRepository)
    private readonly profileRepository: ProfileRepository
  ) {}

  findByUserId(userId: string): Promise<ProfileEntity> {
    return this.profileRepository.findByUserId(userId);
  }

  async saveProfile(
    userId: string,
    data: UpdateUserProfileDTO
  ): Promise<ProfileEntity | UpdateResult> {
    const profile = await this.findByUserId(userId);

    if (!profile) {
      return this.profileRepository.save({ ...data, userId }).catch((error) => {
        throw new CustomError(SAVE_PROFILE_FAILED, error);
      });
    }

    return this.profileRepository
      .update(
        {
          userId,
        },
        { ...data }
      )
      .catch((error) => {
        throw new CustomError(SAVE_PROFILE_FAILED, error);
      });
  }
}
