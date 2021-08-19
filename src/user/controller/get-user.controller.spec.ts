import { Test, TestingModule } from '@nestjs/testing';
import { GetUserController } from './get-user.controller';
import { UserService } from '../service/user.service';
import { userServiceMock } from '../../../test/mock/user.service.mock';
import { MessageService } from '../../queue/service/message.service';
import { messageServiceMock } from '../../../test/mock/message.service.mock';

describe('Get User Controller', () => {
  let controller: GetUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetUserController],
      providers: [
        {
          provide: UserService,
          useValue: userServiceMock,
        },
        {
          provide: MessageService,
          useValue: messageServiceMock,
        },
      ],
    }).compile();

    controller = module.get<GetUserController>(GetUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
