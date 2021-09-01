import { Test, TestingModule } from '@nestjs/testing';
import { UploadFileController } from './upload-file.controller';
import { DICTIONARY } from '../../common/constant/dictionary.constant';
import { googlePhoneNumberMock } from '../../../test/mock/google-phone-number.mock';
import { FileService } from '../service/file.service';
import { fileServiceMock } from '../../../test/mock/file.service.mock';
import { FileCategoryService } from '../service/file-category.service';
import { fileCategoryServiceMock } from '../../../test/mock/file-category.service.mock';

describe('Upload File Controller', () => {
  let controller: UploadFileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadFileController],
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

    controller = module.get<UploadFileController>(UploadFileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
