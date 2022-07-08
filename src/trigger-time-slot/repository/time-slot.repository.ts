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

  findSlotsToInform() {
    const now = new Date().toISOString().slice(0,19).replace('T', ' ');

    return this.createQueryBuilder('ts')
      .leftJoinAndSelect('ts.user', 'u')
      .addSelect('date_sub(ts.to, interval 5 MINUTE)', 'rightThreshold')
      .addSelect('date_add(ts.from, interval 5 MINUTE)', 'leftThreshold')
      .addSelect('DAYOFWEEK(NOW())', 'dayOfWeek')
      .addSelect('NOW()', 'now')
      .where('u.device_id IS NOT NULL')
      .andWhere('ts.active = true')
      .andWhere(
        new Brackets((qb) => {
          qb.where('(ts.from IS NULL and :now1 < ts.to)', { now1: now });
          qb.orWhere(
            `IF (
                    TIME(ts.to) > TIME(ts.from),
                    TIME(:now2) BETWEEN TIME(ts.from) AND TIME(ts.to),
                    TIME(:now2) < TIME(ts.to) OR TIME(:now2) > TIME(ts.from)
                  )`,

                  { now2: now }
          );
        })
      )
      .innerJoin('ts.days', 'd', 'd.day_of_week = DAYOFWEEK(NOW())')
      .execute();
  }

  findActiveTimeSlots(userId: string): Promise<TimeSlotEntity[]> {
    const now = new Date().toISOString().slice(0,19).replace('T', ' ');

    return this.createQueryBuilder('ts')
      .where('ts.user_id = :userId', { userId })
      .andWhere('ts.active = true')
      .andWhere(
        new Brackets((qb) => {
          qb.where('(ts.from IS NULL and :now1 < ts.to)', { now1: now });
          qb.orWhere(
            `IF (
                    TIME(ts.to) > TIME(ts.from),
                    TIME(:now2) BETWEEN TIME(ts.from) AND TIME(ts.to),
                    TIME(:now2) < TIME(ts.to) OR TIME(:now2) > TIME(ts.from)
                  )`,

                  { now2: now }
          );
        })
      )
      .innerJoin('ts.days', 'd', 'd.day_of_week = DAYOFWEEK(NOW())')
      .getMany();
  }
}
