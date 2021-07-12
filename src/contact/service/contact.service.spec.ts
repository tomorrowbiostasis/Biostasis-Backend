import { Test, TestingModule } from '@nestjs/testing';
import { ContactService } from './contact.service';
import { DICTIONARY } from '../../common/constant/dictionary.constant';
import { configMock } from '../../../test/mock/config.mock';
import { ContactRepository } from '../repository/contact.repository';
import { contactRepositoryMock } from '../../../test/mock/contact.repository.mock';

describe('ContactService', () => {
  let service: ContactService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactService,
        {
          provide: DICTIONARY.CONFIG,
          useValue: configMock,
        },
        {
          provide: ContactRepository,
          useValue: contactRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<ContactService>(ContactService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
