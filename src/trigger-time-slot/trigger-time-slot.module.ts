import { Module } from '@nestjs/common';
import { TriggerTimeSlotService } from './service/trigger-time-slot.service';
import { TimeSlotRepositoryProvider } from './provider/time-slot-repository.provider';
import { TimeSlotDayRepositoryProvider } from './provider/time-slot-day-repository.provider';
import { AddTimeSlotController } from './controller/add-time-slot.controller';
import { DeleteTimeSlotController } from './controller/delete-time-slot.controller';
import { GetListOfTimeSlotsController } from './controller/get-list-of-time-slots.controller';
import { UpdateTimeSlotController } from './controller/update-time-slot.controller';
import { ConnectionProvider } from '../common/provider/connection.provider';

@Module({
  controllers: [
    AddTimeSlotController,
    GetListOfTimeSlotsController,
    UpdateTimeSlotController,
    DeleteTimeSlotController,
  ],
  providers: [
    TriggerTimeSlotService,
    TimeSlotRepositoryProvider,
    TimeSlotDayRepositoryProvider,
    ConnectionProvider,
  ],
  exports: [TriggerTimeSlotService, TimeSlotRepositoryProvider],
})
export class TriggerTimeSlotModule {}
