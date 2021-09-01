import { Test, TestingModule } from '@nestjs/testing';
import { DeleteContactController } from './delete-file.controller';
import { FileService } from '../service/file.service';
import { fileServiceMock } from '../../../test/mock/file.service.mock';

describe('Delete File Controller', () => {
  let controller: DeleteContactController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeleteContactController],
      providers: [
        {
          provide: FileService,
          useValue: fileServiceMock,
        },
      ],
    }).compile();

    controller = module.get<DeleteContactController>(DeleteContactController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
