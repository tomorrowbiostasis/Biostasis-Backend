import { Logger } from '@nestjs/common';
import { EntityRepository, Repository, Brackets } from 'typeorm';
import { TimeSlotEntity } from '../entity/time-slot.entity';

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

  findActiveTimeSlots(userId: string): Promise<TimeSlotEntity[]> {
    return this.createQueryBuilder('ts')
      .where('ts.user_id = :userId', { userId })
      .andWhere('ts.active = true')
      .andWhere(
        new Brackets((qb) => {
          qb.where('(ts.from IS NULL and NOW() < ts.to)');
          qb.orWhere(
            `IF (
                    TIME(ts.to) > TIME(ts.from),
                    current_time() BETWEEN TIME(ts.from) AND TIME(ts.to),
                    current_time() < TIME(ts.to) OR current_time() > TIME(ts.from)
                  )`
          );
        })
      )
      .innerJoin('ts.days', 'd', 'd.day_of_week = DAYOFWEEK(NOW())')
      .getMany();
  }
}
