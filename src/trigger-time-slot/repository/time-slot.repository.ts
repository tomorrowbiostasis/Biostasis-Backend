import { Logger } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { TimeSlotEntity } from '../entity/time-slot.entity';

@EntityRepository(TimeSlotEntity)
export class TimeSlotRepository extends Repository<TimeSlotEntity> {
  protected readonly logger = new Logger(TimeSlotRepository.name);

  findByUserId(userId: string): Promise<TimeSlotEntity[]> {
    return new Promise((resolve) => {
      this.find({ where: { userId }, relations: ['days'] })
        .then((data) => resolve(data))
        .catch((error) => this.logger.error(error));
    });
  }
}
