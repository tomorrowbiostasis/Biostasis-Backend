import { EntityRepository, Repository, Brackets, UpdateResult } from 'typeorm';
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

  findWhereRegularNotificationIsNeeded(): Promise<
    {
      userId: string;
      now: Date;
      deviceId: string;
    }[]
  > {
    return this.createQueryBuilder('profile')
      .select('user_id', 'userId')
      .leftJoinAndSelect('profile.user', 'user')
      .addSelect('NOW()', 'now')
      .addSelect('user.device_id', 'deviceId')
      .where('frequency_of_regular_notification IS NOT NULL')
      .andWhere('user.device_id IS NOT NULL')
      .andWhere('regular_push_notification = 1')
      .andWhere(
        new Brackets((qb) => {
          qb.where('regular_notification_time IS NULL');
          qb.orWhere(
            `regular_notification_time + INTERVAL frequency_of_regular_notification MINUTE <= NOW()`
          );
        })
      )
      .execute();
  }

  setRegularNotificationTime(userIds: string[]): Promise<UpdateResult> {
    return this.createQueryBuilder()
      .update(ProfileEntity)
      .set({
        regularNotificationTime: () => 'NOW()',
      })
      .where('user_id IN (:userIds)', { userIds })
      .execute();
  }
}
