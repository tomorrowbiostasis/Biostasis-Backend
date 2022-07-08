import { Test, TestingModule } from '@nestjs/testing';
import { AddTimeSlotController } from './add-time-slot.controller';
import { TriggerTimeSlotService } from '../service/trigger-time-slot.service';
import { triggerTimeSlotServiceMock } from '../../../test/mock/trigger-time-slot.service.mock';

describe('Add Time Slot Controller', () => {
  let controller: AddTimeSlotController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddTimeSlotController],
      providers: [
        {
          provide: TriggerTimeSlotService,
          useValue: triggerTimeSlotServiceMock,
        },
      ],
    }).compile();

    controller = module.get<AddTimeSlotController>(AddTimeSlotController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
