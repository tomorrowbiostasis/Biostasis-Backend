import { EntityRepository, Repository } from 'typeorm';
import { Logger } from '@nestjs/common';
import { ProfileEntity } from '../entity/profile.entity';

@EntityRepository(ProfileEntity)
export class ProfileRepository extends Repository<ProfileEntity> {
  protected readonly logger = new Logger(ProfileRepository.name);

  findByUserId(userId: string): Promise<ProfileEntity> {
    return new Promise((resolve) => {
      this.findOne({ where: { userId }, relations: ['user'] })
        .then((data) => resolve(data))
        .catch((error) => this.logger.error(error));
    });
  }
}
