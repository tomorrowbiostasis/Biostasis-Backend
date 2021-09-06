import { Test, TestingModule } from '@nestjs/testing';
import { FileListController } from './file-list.controller';
import { FileService } from '../service/file.service';
import { fileServiceMock } from '../../../test/mock/file.service.mock';
import { FileCategoryService } from '../service/file-category.service';
import { fileCategoryServiceMock } from '../../../test/mock/file-category.service.mock';

describe('File List Controller', () => {
  let controller: FileListController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileListController],
      providers: [
        {
          provide: FileService,
          useValue: fileServiceMock,
        },
        {
          provide: FileCategoryService,
          useValue: fileCategoryServiceMock,
        },
      ],
    }).compile();

    controller = module.get<FileListController>(FileListController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
