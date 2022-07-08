import { Test, TestingModule } from '@nestjs/testing';
import { ExportUserDataController } from './export-user-data.controller';
import { ProfileService } from '../service/profile.service';
import { profileServiceMock } from '../../../test/mock/profile.service.mock';
import { NotificationService } from '../../notification/service/notification.service';
import { notificationServiceMock } from '../../../test/mock/notification.service.mock';

describe('Export User Data Controller', () => {
  let controller: ExportUserDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExportUserDataController],
      providers: [
        {
          provide: ProfileService,
          useValue: profileServiceMock,
        },
        {
          provide: NotificationService,
          useValue: notificationServiceMock,
        },
      ],
    }).compile();

    controller = module.get<ExportUserDataController>(ExportUserDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
