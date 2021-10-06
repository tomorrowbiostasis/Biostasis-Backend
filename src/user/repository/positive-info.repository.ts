import { EntityRepository, Repository, UpdateResult } from 'typeorm';
import { Logger } from '@nestjs/common';
import { PositiveInfoEntity } from '../entity/positive-info.entity';

@EntityRepository(PositiveInfoEntity)
export class PositiveInfoRepository extends Repository<PositiveInfoEntity> {
  protected readonly logger = new Logger(PositiveInfoRepository.name);

  findExpiredInformation(): Promise<PositiveInfoEntity[]> {
    return new Promise((resolve) => {
      this.createQueryBuilder('positiveInfo')
        .leftJoinAndSelect('positiveInfo.user', 'user')
        .leftJoinAndSelect('user.profile', 'profile')
        .where(
          'date_add(positiveInfo.updated_at , interval minutes_to_next minute) < NOW()'
        )
        .andWhere('user.device_id IS NOT NULL')
        .andWhere('push_notification_time IS NULL')
        .andWhere('regular_push_notification != 1')
        .andWhere('positive_info_period IS NOT NULL')
        .andWhere('sms_time IS NULL')
        .getMany()
        .then((data) => resolve(data))
        .catch((error) => this.logger.error(error));
    });
  }

  findPushNotificationWithoutReaction(): Promise<PositiveInfoEntity[]> {
    return this.createQueryBuilder('positiveInfo')
      .leftJoinAndSelect('positiveInfo.user', 'user')
      .leftJoinAndSelect('user.profile', 'profile')
      .where('push_notification_time IS NOT NULL')
      .andWhere('NOW() > push_notification_time')
      .andWhere('sms_time IS NULL')
      .andWhere('prefix IS NOT NULL')
      .getMany();
  }

  findSmsWithoutReaction(): Promise<PositiveInfoEntity[]> {
    return this.createQueryBuilder('positiveInfo')
      .leftJoinAndSelect('positiveInfo.user', 'user')
      .leftJoinAndSelect('user.profile', 'profile')
      .leftJoinAndSelect('user.contacts', 'contacts')
      .where('sms_time IS NOT NULL')
      .andWhere('NOW() > sms_time')
      .andWhere('trigger_time IS NULL')
      .getMany();
  }

  findByUserId(userId: string): Promise<{ id: number; now: string }> {
    return this.createQueryBuilder()
      .select('id')
      .addSelect('NOW()', 'now')
      .where('user_id = :userId', { userId })
      .execute()
      .then((data) => data.pop())
      .catch((error) => this.logger.error(error));
  }

  setPushNotificationTime(
    userIds: string[],
    period: number
  ): Promise<UpdateResult> {
    return this.createQueryBuilder()
      .update(PositiveInfoEntity)
      .set({
        pushNotificationTime: () => 'NOW() + INTERVAL :period MINUTE',
      })
      .where('user_id IN (:userIds)', { userIds })
      .setParameter('period', period)
      .execute();
  }

  setSmsTime(userId: string, period: number): Promise<UpdateResult> {
    return this.createQueryBuilder()
      .update(PositiveInfoEntity)
      .set({
        smsTime: () => 'NOW() + INTERVAL :period MINUTE',
      })
      .where('user_id = :userId', { userId })
      .setParameter('period', period)
      .execute();
  }

  setTriggerTime(userId: string): Promise<UpdateResult> {
    return this.createQueryBuilder()
      .update(PositiveInfoEntity)
      .set({
        triggerTime: () => 'NOW()',
      })
      .where('user_id = :userId', { userId })

      .execute();
  }
}
