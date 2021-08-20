import { TimeSlotEntity } from '../../src/trigger-time-slot/entity/time-slot.entity';
import { getConnection } from 'typeorm';

export const getTimeSlotById = async (id: number): Promise<TimeSlotEntity> => {
  return getConnection()
    .getRepository(TimeSlotEntity)
    .findOne({
      where: { id },
      relations: ['days'],
    });
};
