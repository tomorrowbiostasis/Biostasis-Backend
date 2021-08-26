import { TimeSlotEntity } from '../../src/trigger-time-slot/entity/time-slot.entity';
import { getConnection } from 'typeorm';
import { omit } from '../../src/common/helper/omit';
import { getEnumKeyByValue } from '../../src/common/helper/get-enum-key-by-value';
import { DAYS_OF_WEEKS } from '../../src/trigger-time-slot/enum/days-of-week.enum';

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
