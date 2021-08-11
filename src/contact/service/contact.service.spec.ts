import { Test, TestingModule } from '@nestjs/testing';
import { ContactService } from './contact.service';
import { DICTIONARY } from '../../common/constant/dictionary.constant';
import { configMock } from '../../../test/mock/config.mock';
import { ContactRepository } from '../repository/contact.repository';
import { contactRepositoryMock } from '../../../test/mock/contact.repository.mock';
import { getUserStub } from '../../../test/entity/user.mock';
import { getContactStub } from '../../../test/entity/contact.mock';

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

  describe('Is method defined', () => {
    it('sendSms is defined', () =>
      expect(service.findActiveContactsByUserId).toBeDefined());
  });

  describe('Check if methods work properly', () => {
    const user = getUserStub();
    const contacts = [
      getContactStub({ userId: user.id, active: false }),
      getContactStub({ userId: user.id, active: true }),
      getContactStub({ userId: user.id, active: true }),
    ];

    it('findActiveContactsByUserId() does call findContactsByUserId() with the expected parameters', async () => {
      jest
        .spyOn(service, 'findContactsByUserId')
        .mockReturnValue(new Promise((res) => res(contacts)));

      const filteredData = await service.findActiveContactsByUserId(user.id);

      expect(filteredData.length).toBe(2);
      expect(filteredData).toEqual(
        contacts.filter((contact) => contact.active)
      );
    });
  });
});
