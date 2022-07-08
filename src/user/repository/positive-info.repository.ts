import { EntityRepository, Repository, UpdateResult, Brackets } from 'typeorm';
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
        .andWhere('profile.automated_emergency = 1')
        .andWhere(
          new Brackets((qb) => {
            qb.where('regular_push_notification IS NULL');
            qb.orWhere(`regular_push_notification = 0`);
          })
        )
        .andWhere('positive_info_period IS NOT NULL')
        .andWhere('sms_time IS NULL')
        .getMany()
        .then((data) => resolve(data))
        .catch((error) => this.logger.error(error));
    });
  }

  findPushNotificationWithoutReaction(
    regularPushNotification: boolean
  ): Promise<PositiveInfoEntity[]> {
    let query = this.createQueryBuilder('positiveInfo')
      .leftJoinAndSelect('positiveInfo.user', 'user')
      .leftJoinAndSelect('user.profile', 'profile')
      .where('push_notification_time IS NOT NULL')
      .andWhere('NOW() >= push_notification_time')
      .andWhere('sms_time IS NULL')
      .andWhere('prefix IS NOT NULL');

    if (regularPushNotification) {
      query.andWhere('regular_push_notification = 1');
    } else {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('regular_push_notification IS NULL');
          qb.orWhere(`regular_push_notification = 0`);
        })
      );
    }

    return query.getMany();
  }

  findSmsWithoutReaction(
    regularPushNotification: boolean,
    column: string
  ): Promise<PositiveInfoEntity[]> {
    let query = this.createQueryBuilder('positiveInfo')
      .leftJoinAndSelect('positiveInfo.user', 'user')
      .leftJoinAndSelect('user.profile', 'profile')
      .leftJoinAndSelect('user.contacts', 'contacts')
      .where(`${column} IS NOT NULL`)
      .andWhere(`NOW() >= ${column}`)
      .andWhere('trigger_time IS NULL');

    if (regularPushNotification) {
      query.andWhere('regular_push_notification = 1');
    } else {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('regular_push_notification IS NULL');
          qb.orWhere(`regular_push_notification = 0`);
        })
      );
    }

    return query.getMany();
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
      .where('user_id IN (:...userIds)', { userIds })
      .setParameter('period', period)
      .execute();
  }

  setSmsTime(
    userId: string,
    smsTime: number,
    alertTime: number
  ): Promise<UpdateResult> {
    return this.createQueryBuilder()
      .update(PositiveInfoEntity)
      .set({
        smsTime: () => 'NOW() + INTERVAL :smsTime MINUTE',
        alertTime: () => 'NOW() + INTERVAL :alertTime MINUTE',
      })
      .where('user_id = :userId', { userId })
      .setParameter('smsTime', smsTime)
      .setParameter('alertTime', alertTime)
      .execute();
  }

  clearAlertTime(userIds: string[]): Promise<UpdateResult> {
    return this.createQueryBuilder()
      .update(PositiveInfoEntity)
      .set({
        alertTime: null,
      })
      .where('user_id IN (:...userIds)', { userIds })
      .execute();
  }

  clearEverythingForUsers(userIds: string[]): Promise<UpdateResult> {
    return this.createQueryBuilder()
      .update(PositiveInfoEntity)
      .set({
        alertTime: null,
        smsTime: null,
        pushNotificationTime: null,
        triggerTime: null,
      })
      .where('user_id IN (:...userIds)', { userIds })
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

  postponeBySlotTime(userId: string): Promise<UpdateResult> {
    return this.createQueryBuilder()
      .update(PositiveInfoEntity)
      .set({
        updatedAt: () => 'NOW()',
      })
      .where('user_id = :userId', { userId })
      .execute();
  }
}
