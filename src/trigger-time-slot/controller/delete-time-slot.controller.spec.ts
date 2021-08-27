import { Test, TestingModule } from '@nestjs/testing';
import { DeleteTimeSlotController } from './delete-time-slot.controller';
import { TriggerTimeSlotService } from '../service/trigger-time-slot.service';
import { triggerTimeSlotServiceMock } from '../../../test/mock/trigger-time-slot.service.mock';

describe('Delete Time Slot Controller', () => {
  let controller: DeleteTimeSlotController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeleteTimeSlotController],
      providers: [
        {
          provide: TriggerTimeSlotService,
          useValue: triggerTimeSlotServiceMock,
        },
      ],
    }).compile();

    controller = module.get<DeleteTimeSlotController>(DeleteTimeSlotController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
