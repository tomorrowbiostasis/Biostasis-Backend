import { EntityRepository, Repository } from 'typeorm';
import { TimeSlotDayEntity } from '../entity/time-slot-day.entity';

@EntityRepository(TimeSlotDayEntity)
export class TimeSlotDayRepository extends Repository<TimeSlotDayEntity> {}
