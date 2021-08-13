import { Test, TestingModule } from '@nestjs/testing';
import { UpdateContactController } from './update-contact.controller';
import { DICTIONARY } from '../../common/constant/dictionary.constant';
import { googlePhoneNumberMock } from '../../../test/mock/google-phone-number.mock';
import { ContactService } from '../service/contact.service';
import { contactServiceMock } from '../../../test/mock/contact.service.mock';

describe('Update Contact Controller', () => {
  let controller: UpdateContactController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UpdateContactController],
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

    controller = module.get<UpdateContactController>(UpdateContactController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
