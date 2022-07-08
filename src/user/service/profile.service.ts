import {
  Inject,
  Injectable,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { ProfileRepository } from '../repository/profile.repository';
import { ProfileEntity } from '../entity/profile.entity';
import { SAVE_PROFILE_FAILED } from '../../common/error/keys';
import { UpdateUserProfileDTO } from '../request/dto/update-user-profile.dto';

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);

  constructor(
    @Inject(ProfileRepository)
    private readonly profileRepository: ProfileRepository
  ) {}

  findByUserId(userId: string): Promise<ProfileEntity> {
    return this.profileRepository.findByUserId(userId);
  }

  async saveProfile(
    profile: ProfileEntity,
    data: UpdateUserProfileDTO
  ): Promise<ProfileEntity> {
    return this.profileRepository
      .save({ ...profile, ...data })
      .catch((error) => {
        this.logger.error(error);
        throw new BadRequestException(SAVE_PROFILE_FAILED);
      });
  }
}
