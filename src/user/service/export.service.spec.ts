import { Test, TestingModule } from '@nestjs/testing';
import { ExportService } from './export.service';
import { ProfileRepository } from '../repository/profile.repository';
import { profileRepositoryMock } from '../../../test/mock/profile.repository.mock';
import { ContactRepository } from '../../contact/repository/contact.repository';
import { contactRepositoryMock } from '../../../test/mock/contact.repository.mock';
import { UserRepository } from '../../user/repository/user.repository';
import { userRepositoryMock } from '../../../test/mock/user.repository.mock';
import { TimeSlotRepository } from '../../trigger-time-slot/repository/time-slot.repository';
import { timeSlotRepositoryMock } from '../../../test/mock/time-slot.repository.mock';
import { ContactService } from '../../contact/service/contact.service';
import { contactServiceMock } from '../../../test/mock/contact.service.mock';
import { UnconfirmedEmailRepository } from '../../user/repository/unconfirmed-email.repository';
import { unconfirmedEmailRepositoryMock } from '../../../test/mock/unconfirmed-email.repository.mock';
import { FileRepository } from '../../file/repository/file.repository';
import { fileRepositoryMock } from '../../../test/mock/file.repository.mock';
import { FileService } from '../../file/service/file.service';
import { fileServiceMock } from '../../../test/mock/file.service.mock';

describe('ExportService', () => {
  let service: ExportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExportService,
        {
          provide: ProfileRepository,
          useValue: profileRepositoryMock,
        },
        {
          provide: ContactRepository,
          useValue: contactRepositoryMock,
        },
        {
          provide: UserRepository,
          useValue: userRepositoryMock,
        },
        {
          provide: TimeSlotRepository,
          useValue: timeSlotRepositoryMock,
        },
        {
          provide: ContactService,
          useValue: contactServiceMock,
        },
        {
          provide: UnconfirmedEmailRepository,
          useValue: unconfirmedEmailRepositoryMock,
        },
        {
          provide: FileRepository,
          useValue: fileRepositoryMock,
        },
        {
          provide: FileService,
          useValue: fileServiceMock,
        },
      ],
    }).compile();

    service = module.get<ExportService>(ExportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
