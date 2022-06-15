import {
  Inject,
  Injectable,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { TimeSlotRepository } from '../repository/time-slot.repository';
import { TimeSlotEntity } from '../entity/time-slot.entity';
import { TimeSlotDayEntity } from '../entity/time-slot-day.entity';
import { AddTimeSlotDTO } from '../request/dto/add-time-slot.dto';
import {
  SAVE_TIME_SLOT_FAILED,
  DELETE_TIME_SLOT_FAILED,
  RETRIEVING_TIME_SLOTS_FAILED,
  TIME_SLOT_NOT_FOUND,
  UPDATE_TIME_SLOT_FAILED,
} from '../../common/error/keys';
import { CustomError } from '../../common/error/custom-error';
import { omit } from '../../common/helper/omit';
import { DAYS_OF_WEEKS } from '../enum/days-of-week.enum';
import { getEnumKeyByValue } from '../../common/helper/get-enum-key-by-value';
import { In, Connection, DeleteResult } from 'typeorm';
import { DICTIONARY } from '../../common/constant/dictionary.constant';
import { MessageService } from '../../message/service/mesage.service';
import { MESSAGE_TYPE } from '../../message/constant/message-type.constant';
import * as moment from "moment";
import { date } from 'joi';
import { modifyTimeAccordingTimezone } from '../../common/helper/modify-time-according-timezone';

@Injectable()
export class TriggerTimeSlotService {
  protected readonly logger = new Logger(TriggerTimeSlotService.name);

  constructor(
    @Inject(TimeSlotRepository)
    private readonly timeSlotRepository: TimeSlotRepository,
    @Inject(DICTIONARY.CONNECTION)
    private readonly connection: Connection,
    private readonly messageService: MessageService,
  ) { }

  async findByUserIdAndPeriodStart(
    userId: string,
    from: Date
  ): Promise<TimeSlotEntity> {
    return this.timeSlotRepository.findOneByParams({
      where: { from, userId },
      relations: ['days'],
    });
  }

  async findByIdAndUserIdOrFail(
    id: number,
    userId: string
  ): Promise<TimeSlotEntity> {
    return this.timeSlotRepository
      .findOneByParams({ where: { id, userId }, relations: ['days'] })
      .then((data) => {
        if (!data) {
          throw new BadRequestException(TIME_SLOT_NOT_FOUND);
        }

        return data;
      });
  }

  async deleteTimeSlot(timeSlotId: number): Promise<DeleteResult> {
    return this.timeSlotRepository.delete(timeSlotId).catch((error) => {
      this.logger.error(error);
      throw new BadRequestException(DELETE_TIME_SLOT_FAILED);
    });
  }

  async getActiveTimeSlot(userId: string): Promise<TimeSlotEntity> {
    const slots = await this.timeSlotRepository.findActiveTimeSlots(userId);

    return slots.length > 0 ? slots[0] : null;
  }

  async getSlotsToInform(): Promise<any> {
    return this.timeSlotRepository.findSlotsToInform();
  }

  async findByUserIdOrFail(userId: string): Promise<TimeSlotEntity[]> {
    return this.timeSlotRepository.findByUserId(userId).then((data) => {
      if (!data) {
        throw new BadRequestException(RETRIEVING_TIME_SLOTS_FAILED);
      }

      return data;
    });
  }

  async isActiveTimeSlot(userId: string): Promise<boolean> {
    return this.timeSlotRepository.findActiveTimeSlots(userId).then((data) => {
      if (data.length > 0) {
        return true;
      }

      return false;
    });
  }

  async saveTimeSlot(
    userId: string,
    data: AddTimeSlotDTO
  ): Promise<TimeSlotEntity> {
    Logger.log(`Saving slot: `, data, userId);

    const addedSlot = await this.timeSlotRepository
      .save({
        ...omit(data, ['days']),
        userId,
        days: data.days.map((value) => ({
          day: DAYS_OF_WEEKS[value.toUpperCase()],
        })),
      })
      .catch((error) => {
        this.logger.error(error);
        throw new BadRequestException(SAVE_TIME_SLOT_FAILED);
      });

    if (!data.from) {
      const { user, ...slot } = await this.timeSlotRepository.findOneByParams({
        where: { id: addedSlot.id, userId },
        relations: ['days', 'user'],
      });

      Logger.log(`Pause set: `, slot.to);

      slot.active && (await this.informAboutPause(user.deviceId, slot.to as any, data.timezone));
    }

    return addedSlot;
  }

  async updateTimeSlot(
    timeSlot: TimeSlotEntity,
    userId: string,
    data: AddTimeSlotDTO
  ): Promise<TimeSlotEntity> {
    Logger.log(`Saving slot: `, data, userId);

    const namesOfDays = timeSlot.days.map((item) =>
      getEnumKeyByValue(DAYS_OF_WEEKS, item.day)
    );

    try {
      await this.connection.manager.transaction(async (entityManager) => {
        await entityManager.update(
          TimeSlotEntity,
          {
            id: timeSlot.id,
          },
          { ...omit(data, ['days']) }
        );

        await entityManager.delete(TimeSlotDayEntity, {
          timeSlotId: timeSlot.id,
          day: In(
            namesOfDays
              .filter((value) => !data.days.includes(value))
              .map((value) => DAYS_OF_WEEKS[value.toUpperCase()])
          ),
        });

        await entityManager.save(
          TimeSlotDayEntity,
          data.days
            .filter((value) => !namesOfDays.includes(value))
            .map((day) => ({
              timeSlotId: timeSlot.id,
              day: DAYS_OF_WEEKS[day.toUpperCase()],
            }))
        );
      });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(UPDATE_TIME_SLOT_FAILED);
    }

    const { user, ...slot } = await this.timeSlotRepository.findOneByParams({
      where: { id: timeSlot.id, userId },
      relations: ['days', 'user'],
    });

    if (!data.from && slot.active) {
      Logger.log(`Pause set: `, slot.to);

      await this.informAboutPause(user.deviceId, slot.to as any, data.timezone);
    }

    return slot as any;
  }

  private async informAboutPause(deviceId: string, to: string, timezone: string) {
    await this.messageService.sendMessageToDevice(deviceId, {
      title: 'Biostasis automated system is disabled',
      message: `The system will be paused until ${modifyTimeAccordingTimezone(to, timezone)}`,
      type: MESSAGE_TYPE.TIME_SLOT_NOTIFICATION,
    });
  }
}
