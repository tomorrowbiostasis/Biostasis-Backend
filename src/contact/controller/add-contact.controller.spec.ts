import { Test, TestingModule } from '@nestjs/testing';
import { AddContactController } from './add-contact.controller';
import { DICTIONARY } from '../../common/constant/dictionary.constant';
import { googlePhoneNumberMock } from '../../../test/mock/google-phone-number.mock';
import { ContactService } from '../service/contact.service';
import { contactServiceMock } from '../../../test/mock/contact.service.mock';

describe('Add Contact Controller', () => {
  let controller: AddContactController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddContactController],
      providers: [
        {
          provide: ContactService,
          useValue: contactServiceMock,
        },
        {
          provide: DICTIONARY.GOOGLE_PHONE_NUMBER,
          useValue: googlePhoneNumberMock,
        },
      ],
    }).compile();

    controller = module.get<AddContactController>(AddContactController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
