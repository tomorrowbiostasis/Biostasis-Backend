import { Connection } from 'typeorm';
import { TimeSlotRepository } from '../repository/time-slot.repository';

export const TimeSlotRepositoryProvider = {
  provide: TimeSlotRepository,
  useFactory: (connection: Connection) =>
    connection.getCustomRepository(TimeSlotRepository),
  inject: [Connection],
};
