import { Module } from '@nestjs/common';
import { TriggerTimeSlotService } from './service/trigger-time-slot.service';
import { TimeSlotRepositoryProvider } from './provider/time-slot-repository.provider';
import { AddTimeSlotController } from './controller/add-time-slot.controller';
import { GetListOfTimeSlotsController } from './controller/get-list-of-time-slots.controller';

@Module({
  controllers: [AddTimeSlotController, GetListOfTimeSlotsController],
  providers: [TriggerTimeSlotService, TimeSlotRepositoryProvider],
  exports: [TriggerTimeSlotService],
})
export class TriggerTimeSlotModule {}
