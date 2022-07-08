import { Connection } from 'typeorm';
import { TimeSlotDayRepository } from '../repository/time-slot-day.repository';

export const TimeSlotDayRepositoryProvider = {
  provide: TimeSlotDayRepository,
  useFactory: (connection: Connection) =>
    connection.getCustomRepository(TimeSlotDayRepository),
  inject: [Connection],
};
