import { Test, TestingModule } from '@nestjs/testing';
import { FileService } from './file.service';
import { DICTIONARY as COMMON_DI } from '../../common/constant/dictionary.constant';
import { configMock } from '../../../test/mock/config.mock';
import { FileRepository } from '../repository/file.repository';
import { fileRepositoryMock } from '../../../test/mock/file.repository.mock';
import { s3Mock } from '../../../test/mock/s3.mock';
import { DICTIONARY } from '../constant/dictionary.constant';
import { cloudFrontSignerMock } from '../../../test/mock/cloud-front-signer.mock';

describe('FileService', () => {
  let service: FileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileService,
        {
          provide: COMMON_DI.CONFIG,
          useValue: configMock,
        },
        {
          provide: DICTIONARY.S3,
          useValue: s3Mock,
        },
        {
          provide: DICTIONARY.CLOUD_FRONT_SIGNER,
          useValue: cloudFrontSignerMock,
        },
        {
          provide: FileRepository,
          useValue: fileRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<FileService>(FileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
