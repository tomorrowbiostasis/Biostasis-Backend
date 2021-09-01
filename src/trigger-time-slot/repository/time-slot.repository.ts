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

  getCurrentTime() {
    return this.createQueryBuilder('ts').select('NOW()', 'now').execute();
  }

  findActiveTimeSlots(userId: string): Promise<TimeSlotEntity[]> {
    return this.createQueryBuilder('ts')
      .addSelect('NOW()', 'now')
      .where('ts.user_id = :userId', { userId })
      .andWhere('ts.active = true')
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            '(ts.from IS NULL and NOW() BETWEEN ts.created_at AND ts.to)'
          );
          qb.orWhere('NOW() BETWEEN ts.from AND ts.to');
        })
      )
      .innerJoin('ts.days', 'd', 'd.day_of_week = DAYOFWEEK(NOW())')
      .orderBy('ts.to', 'DESC')
      .getMany();
  }
}
