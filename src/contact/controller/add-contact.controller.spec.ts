import { Test, TestingModule } from '@nestjs/testing';
import { AddContactController } from './add-contact.controller';
import { ContactService } from '../service/contact.service';
import { contactServiceMock } from '../../../test/mock/contact.service.mock';

describe('Add Calendar Controller', () => {
  let controller: AddContactController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddContactController],
      providers: [
        {
          provide: ContactService,
          useValue: contactServiceMock,
        },
      ],
    }).compile();

    controller = module.get<AddContactController>(AddContactController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
