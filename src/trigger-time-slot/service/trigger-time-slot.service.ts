import { Inject, Injectable } from '@nestjs/common';
import { TimeSlotRepository } from '../repository/time-slot.repository';
import { TimeSlotEntity } from '../entity/time-slot.entity';
import { AddTimeSlotDTO } from '../request/dto/add-time-slot.dto';
import { SAVE_TIME_SLOT_FAILED } from '../../common/error/keys';
import { CustomError } from '../../common/error/custom-error';
import { omit } from '../../common/helper/omit';
import { DAYS_OF_WEEKS } from '../enum/days-of-week.enum';

@Injectable()
export class TriggerTimeSlotService {
  constructor(
    @Inject(TimeSlotRepository)
    private readonly timeSlotRepository: TimeSlotRepository
  ) {}

  async saveTimeSlot(
    userId: string,
    data: AddTimeSlotDTO
  ): Promise<TimeSlotEntity> {
    return this.timeSlotRepository
      .save({
        ...omit(data, ['days']),
        from: data.from ?? userId,
        days: data.days.map((value) => ({
          day: DAYS_OF_WEEKS[value.toUpperCase()],
        })),
      })
      .catch((error) => {
        throw new CustomError(SAVE_TIME_SLOT_FAILED, error);
      });
  }
}
