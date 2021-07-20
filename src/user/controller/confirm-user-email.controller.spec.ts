import { Test, TestingModule } from '@nestjs/testing';
import { ConfirmUserEmailController } from './confirm-user-email.controller';
import { UnconfirmedEmailService } from '../service/unconfirmed-email.service';
import { unconfirmedEmailServiceMock } from '../../../test/mock/unconfirmed-email.service.mock';
import { UserService } from '../service/user.service';
import { userServiceMock } from '../../../test/mock/user.service.mock';

describe('Confirm User Email Controller', () => {
  let controller: ConfirmUserEmailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConfirmUserEmailController],
      providers: [
        {
          provide: UnconfirmedEmailService,
          useValue: unconfirmedEmailServiceMock,
        },
        {
          provide: UserService,
          useValue: userServiceMock,
        },
      ],
    }).compile();

    controller = module.get<ConfirmUserEmailController>(
      ConfirmUserEmailController
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
