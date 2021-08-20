import { Logger } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { TimeSlotEntity } from '../entity/time-slot.entity';

@EntityRepository(TimeSlotEntity)
export class TimeSlotRepository extends Repository<TimeSlotEntity> {
  protected readonly logger = new Logger(TimeSlotRepository.name);
}
