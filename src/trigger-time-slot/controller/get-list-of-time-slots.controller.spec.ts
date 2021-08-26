import { Test, TestingModule } from '@nestjs/testing';
import { GetListOfTimeSlotsController } from './get-list-of-time-slots.controller';
import { TriggerTimeSlotService } from '../service/trigger-time-slot.service';
import { triggerTimeSlotServiceMock } from '../../../test/mock/trigger-time-slot.service.mock';

describe('Get List Of Time Slots Controller', () => {
  let controller: GetListOfTimeSlotsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetListOfTimeSlotsController],
      providers: [
        {
          provide: TriggerTimeSlotService,
          useValue: triggerTimeSlotServiceMock,
        },
      ],
    }).compile();

    controller = module.get<GetListOfTimeSlotsController>(
      GetListOfTimeSlotsController
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
