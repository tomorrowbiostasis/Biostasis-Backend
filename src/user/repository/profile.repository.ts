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
      timezone?: string;
    }[]
  > {
    return this.createQueryBuilder('profile')
      .select('profile.user_id', 'userId')
      .leftJoinAndSelect('profile.user', 'user')
      .leftJoin('user.positiveInfo', 'positiveInfo')
      .addSelect('NOW()', 'now')
      .addSelect('user.device_id', 'deviceId')
      .addSelect('profile.timezone', 'timezone')
      .where('frequency_of_regular_notification IS NOT NULL')
      .andWhere('positiveInfo.push_notification_time IS NULL')
      .andWhere('positiveInfo.sms_time IS NULL')
      .andWhere('user.device_id IS NOT NULL')
      .andWhere('regular_push_notification = 1')
      .andWhere('automated_emergency = 1')
      .andWhere(
        'date_add(positiveInfo.updated_at, interval frequency_of_regular_notification minute) < NOW()'
      )
      // .andWhere(
      //   new Brackets((qb) => {
      //     qb.where('regular_notification_time IS NULL');
      //     qb.orWhere(
      //       `regular_notification_time + INTERVAL frequency_of_regular_notification MINUTE <= NOW()`
      //     );
      //   })
      // )
      .execute();
  }

  setRegularNotificationTime(userIds: string[]): Promise<UpdateResult> {
    return this.createQueryBuilder()
      .update(ProfileEntity)
      .set({
        regularNotificationTime: () => 'NOW()',
      })
      .where('user_id IN (:...userIds)', { userIds })
      .execute();
  }

  disableAutomatedEmergencyForUsers(userIds: string[]): Promise<UpdateResult> {
    return this.createQueryBuilder()
      .update(ProfileEntity)
      .set({
        automatedEmergency: false
      })
      .where('user_id IN (:...userIds)', { userIds })
      .execute();
  }
}
