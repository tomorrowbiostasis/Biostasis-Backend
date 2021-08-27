import { Test, TestingModule } from '@nestjs/testing';
import { TriggerTimeSlotService } from './trigger-time-slot.service';
import { DICTIONARY } from '../../common/constant/dictionary.constant';
import { connectionMock } from '../../../test/mock/connection.mock';
import { TimeSlotRepository } from '../repository/time-slot.repository';
import { timeSlotRepositoryMock } from '../../../test/mock/time-slot.repository.mock';

describe('ContactService', () => {
  let service: TriggerTimeSlotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TriggerTimeSlotService,
        {
          provide: DICTIONARY.CONNECTION,
          useValue: connectionMock,
        },
        {
          provide: TimeSlotRepository,
          useValue: timeSlotRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<TriggerTimeSlotService>(TriggerTimeSlotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
