import { Test, TestingModule } from '@nestjs/testing';
import { PositiveInfoService } from './positive-info.service';
import { PositiveInfoRepository } from '../repository/positive-info.repository';
import { positiveInfoRepositoryMock } from '../../../test/mock/positive-info.repository.mock';

describe('PositiveInfoService', () => {
  let service: PositiveInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PositiveInfoService,
        {
          provide: PositiveInfoRepository,
          useValue: positiveInfoRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<PositiveInfoService>(PositiveInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
