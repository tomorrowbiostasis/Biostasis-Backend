import { Test, TestingModule } from '@nestjs/testing';
import { SchedulerService } from './scheduler.service';
import { PositiveInfoRepository } from '../user/repository/positive-info.repository';
import { positiveInfoRepositoryMock } from '../../test/mock/positive-info.repository.mock';

describe('SchedulerService', () => {
  let service: SchedulerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SchedulerService,
        {
          provide: PositiveInfoRepository,
          useValue: positiveInfoRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<SchedulerService>(SchedulerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
