import { Logger } from '@nestjs/common';
import { EntityRepository, Repository, In, Brackets } from 'typeorm';
import { TimeSlotEntity } from '../entity/time-slot.entity';
import * as moment from 'moment';

@EntityRepository(TimeSlotEntity)
export class TimeSlotRepository extends Repository<TimeSlotEntity> {
  protected readonly logger = new Logger(TimeSlotRepository.name);

  findOneByParams(params: Record<string, unknown>): Promise<TimeSlotEntity> {
    return new Promise((resolve) => {
      this.findOne(params)
        .then((data) => resolve(data))
        .catch((error) => this.logger.error(error));
    });
  }

  findByUserId(userId: string): Promise<TimeSlotEntity[]> {
    return new Promise((resolve) => {
      this.find({ where: { userId }, relations: ['days'] })
        .then((data) => resolve(data))
        .catch((error) => this.logger.error(error));
    });
  }

  findActiveTimeSlots(
    userId: string
  ): Promise<(TimeSlotEntity & { seconds: string })[]> {
    return this.createQueryBuilder('ts')
      .addSelect(
        'timestampdiff(SECOND, IF(ts.from IS NULL, NOW(), current_time()), IF(ts.from IS NULL, ts.to, TIME(ts.to)))',
        'seconds'
      )
      .where('ts.user_id = :userId', { userId })
      .andWhere('ts.active = true')
      .andWhere(
        new Brackets((qb) => {
          qb.where('(ts.from IS NULL and NOW() < ts.to)');
          qb.orWhere('current_time() BETWEEN TIME(ts.from) AND TIME(ts.to)');
        })
      )
      .innerJoin('ts.days', 'd', 'd.day_of_week = DAYOFWEEK(NOW())')
      .orderBy('IF(ts.from IS NULL, ts.to, TIME(ts.to))', 'DESC')
      .limit(1)
      .execute();
  }
}
