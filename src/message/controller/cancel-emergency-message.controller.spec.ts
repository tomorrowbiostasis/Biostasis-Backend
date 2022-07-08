import { Test, TestingModule } from '@nestjs/testing';
import { CancelEmergencyMessageController } from './cancel-emergency-message.controller';
import { MessageService } from '../../queue/service/message.service';
import { messageServiceMock } from '../../../test/mock/message.service.mock';

describe('Cancel Emergency Message Controller', () => {
  let controller: CancelEmergencyMessageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CancelEmergencyMessageController],
      providers: [
        {
          provide: MessageService,
          useValue: messageServiceMock,
        },
      ],
    }).compile();

    controller = module.get<CancelEmergencyMessageController>(
      CancelEmergencyMessageController
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
