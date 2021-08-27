import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { TimeSlotRepository } from '../repository/time-slot.repository';
import { TimeSlotEntity } from '../entity/time-slot.entity';
import { AddTimeSlotDTO } from '../request/dto/add-time-slot.dto';
import {
  SAVE_TIME_SLOT_FAILED,
  TIME_SLOT_NOT_FOUND,
  DELETE_TIME_SLOT_FAILED,
  RETRIEVING_TIME_SLOTS_FAILED,
} from '../../common/error/keys';
import { CustomError } from '../../common/error/custom-error';
import { omit } from '../../common/helper/omit';
import { DAYS_OF_WEEKS } from '../enum/days-of-week.enum';
import * as moment from 'moment';

@Injectable()
export class TriggerTimeSlotService {
  constructor(
    @Inject(TimeSlotRepository)
    private readonly timeSlotRepository: TimeSlotRepository
  ) {}

  async findByIdAndUserIdOrFail(
    id: number,
    userId: string
  ): Promise<TimeSlotEntity> {
    return this.timeSlotRepository
      .findOneByParams({
        id,
        userId,
      })
      .then((data) => {
        if (!data) {
          throw new BadRequestException(TIME_SLOT_NOT_FOUND);
        }

        return data;
      });
  }

  async deleteTimeSlot(timeSlotId: number): Promise<DeleteResult> {
    return this.timeSlotRepository.delete(timeSlotId).catch((error) => {
      throw new CustomError(DELETE_TIME_SLOT_FAILED, error);
    });
  }

  async findByUserIdOrFail(userId: string): Promise<TimeSlotEntity[]> {
    return this.timeSlotRepository.findByUserId(userId).then((data) => {
      if (!data) {
        throw new BadRequestException(RETRIEVING_TIME_SLOTS_FAILED);
      }

      return data;
    });
  }

  async saveTimeSlot(
    userId: string,
    data: AddTimeSlotDTO
  ): Promise<TimeSlotEntity> {
    return this.timeSlotRepository
      .save({
        ...omit(data, ['days']),
        userId,
        days: data.days.map((value) => ({
          day: DAYS_OF_WEEKS[value.toUpperCase()],
        })),
      })
      .catch((error) => {
        throw new CustomError(SAVE_TIME_SLOT_FAILED, error);
      });
  }
}
