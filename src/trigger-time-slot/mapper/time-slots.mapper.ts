import { TimeSlotEntity } from '../entity/time-slot.entity';
import { TimeSlotRO } from '../response/time-slot.ro';
import { timeSlotMapper } from './time-slot.mapper';

export const timeSlotsMapper = (timeSlots: TimeSlotEntity[]): TimeSlotRO[] =>
  timeSlots.map((entity) => timeSlotMapper(entity));
