import { Test, TestingModule } from '@nestjs/testing';
import { FileCategoryService } from './file-category.service';
import { FileCategoryRepository } from '../repository/file-category.repository';
import { fileCategoryRepositoryMock } from '../../../test/mock/file-category.repository.mock';

describe('FileCategoryService', () => {
  let service: FileCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileCategoryService,
        {
          provide: FileCategoryRepository,
          useValue: fileCategoryRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<FileCategoryService>(FileCategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
