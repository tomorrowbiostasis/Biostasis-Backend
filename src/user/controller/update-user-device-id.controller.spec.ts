import { Test, TestingModule } from '@nestjs/testing';
import { UpdateUserDeviceIdentifierController } from './update-user-device-id.controller';
import { UserService } from '../service/user.service';
import { userServiceMock } from '../../../test/mock/user.service.mock';

describe('Update User Device Controller', () => {
  let controller: UpdateUserDeviceIdentifierController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UpdateUserDeviceIdentifierController],
      providers: [
        {
          provide: UserService,
          useValue: userServiceMock,
        },
      ],
    }).compile();

    controller = module.get<UpdateUserDeviceIdentifierController>(
      UpdateUserDeviceIdentifierController
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
