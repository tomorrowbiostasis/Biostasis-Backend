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
        .where(
          'date_add(positiveInfo.updated_at , interval positiveInfo.minutes_to_next minute) < NOW()'
        )
        .andWhere('positiveInfo.push_notification_time IS NULL')
        .getMany()
        .then((data) => resolve(data))
        .catch((error) => this.logger.error(error));
    });
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
}
