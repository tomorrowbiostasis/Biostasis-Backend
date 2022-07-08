import { TimeSlotEntity } from '../../src/trigger-time-slot/entity/time-slot.entity';
import { getConnection } from 'typeorm';
import * as faker from 'faker';
import * as moment from 'moment';
import { ITimeSlotData } from '../interface/time-slot-data.interface';
import { omit } from '../../src/common/helper/omit';
import { getEnumKeyByValue } from '../../src/common/helper/get-enum-key-by-value';
import { DAYS_OF_WEEKS } from '../../src/trigger-time-slot/enum/days-of-week.enum';

export const getTimeSlotStub = (data?: ITimeSlotData): TimeSlotEntity => {
  const timeSlot = new TimeSlotEntity();

  timeSlot.id = data?.id;
  timeSlot.active = data?.active ?? faker.datatype.boolean();
  timeSlot.from = data?.from !== undefined ? data.from : moment().toDate();
  timeSlot.to = data?.to ?? moment().toDate();
  timeSlot.userId = data.userId;

  return timeSlot;
};

export const addTimeSlot = async (
  data: ITimeSlotData
): Promise<TimeSlotEntity> => {
  const timeSlot = getTimeSlotStub(data);

  return getConnection()
    .getRepository(TimeSlotEntity)
    .save({
      ...timeSlot,
      days: data.days,
    });
};

export const getTimeSlotById = async (id: number): Promise<TimeSlotEntity> => {
  return getConnection()
    .getRepository(TimeSlotEntity)
    .findOne({
      where: { id },
      relations: ['days'],
    });
};

export const checkTimeSlot = async (response: any) => {
  const timeSlotId = response.id;
  const timeSlotDB = await getTimeSlotById(timeSlotId);

  expect(
    omit(
      {
        ...response,
        to: String(response.to),
      },
      ['days']
    )
  ).toEqual(
    omit(
      {
        ...timeSlotDB,
        from: timeSlotDB.from ? timeSlotDB.from.toISOString() : null,
        to: timeSlotDB.to.toISOString(),
        createdAt: timeSlotDB.createdAt.toISOString(),
      },
      ['days', 'userId']
    )
  );

  expect(
    timeSlotDB.days
      .map((item) => getEnumKeyByValue(DAYS_OF_WEEKS, item.day))
      .sort()
  ).toEqual(response.days.sort());
};
