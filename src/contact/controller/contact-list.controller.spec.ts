import { Test, TestingModule } from '@nestjs/testing';
import { ContactListController } from './contact-list.controller';
import { ContactService } from '../service/contact.service';
import { contactServiceMock } from '../../../test/mock/contact.service.mock';

describe('Contact List Controller', () => {
  let controller: ContactListController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactListController],
      providers: [
        {
          provide: ContactService,
          useValue: contactServiceMock,
        },
      ],
    }).compile();

    controller = module.get<ContactListController>(ContactListController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
