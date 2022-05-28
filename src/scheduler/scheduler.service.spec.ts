import { Test, TestingModule } from '@nestjs/testing';
import { SchedulerService } from './scheduler.service';
import { PositiveInfoRepository } from '../user/repository/positive-info.repository';
import { MessageService } from '../message/service/mesage.service';
import { positiveInfoRepositoryMock } from '../../test/mock/positive-info.repository.mock';
import { messageServiceMock } from '../../test/mock/message.service.mock';
import { DICTIONARY } from '../common/constant/dictionary.constant';
import { configMock } from '../../test/mock/config.mock';
import { NotificationService } from '../notification/service/notification.service';
import { notificationServiceMock } from '../../test/mock/notification.service.mock';
import { ProfileRepository } from '../user/repository/profile.repository';
import { profileRepositoryMock } from '../../test/mock/profile.repository.mock';
import { TriggerTimeSlotService } from '../trigger-time-slot/service/trigger-time-slot.service';
import { triggerTimeSlotServiceMock } from '../../test/mock/trigger-time-slot.service.mock';

describe('SchedulerService', () => {
  let service: SchedulerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SchedulerService,
        {
          provide: DICTIONARY.CONFIG,
          useValue: configMock,
        },
        {
          provide: PositiveInfoRepository,
          useValue: positiveInfoRepositoryMock,
        },
        {
          provide: MessageService,
          useValue: messageServiceMock,
        },
        {
          provide: NotificationService,
          useValue: notificationServiceMock,
        },
        {
          provide: ProfileRepository,
          useValue: profileRepositoryMock,
        },
        {
          provide: TriggerTimeSlotService,
          useValue: triggerTimeSlotServiceMock,
        },
      ],
    }).compile();

    service = module.get<SchedulerService>(SchedulerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
