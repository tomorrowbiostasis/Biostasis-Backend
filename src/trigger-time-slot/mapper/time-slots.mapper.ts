import { plainToClass } from 'class-transformer';
import { TimeSlotEntity } from '../entity/time-slot.entity';
import { TimeSlotRO } from '../response/time-slot.ro';
import { getEnumKeyByValue } from '../../common/helper/get-enum-key-by-value';
import { DAYS_OF_WEEKS } from '../enum/days-of-week.enum';

export const timeSlotsMapper = (timeSlots: TimeSlotEntity[]): TimeSlotRO[] =>
  timeSlots.map((entity) =>
    plainToClass(TimeSlotRO, {
      ...entity,
      days: entity.days.map((item) =>
        getEnumKeyByValue(DAYS_OF_WEEKS, item.day)
      ),
    })
  );
