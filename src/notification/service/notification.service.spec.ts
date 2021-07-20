import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { DICTIONARY } from '../../common/constant/dictionary.constant';
import { mailJetMock } from '../../../test/mock/mailjet.mock';
import { configMock } from '../../../test/mock/config.mock';
import { DICTIONARY as NOTIFICATION_DI } from '../constant/dictionary.constant';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: NOTIFICATION_DI.MAIL_JET,
          useValue: mailJetMock,
        },
        {
          provide: DICTIONARY.CONFIG,
          useValue: configMock,
        },
      ],
    }).compile();

    service = app.get<NotificationService>(NotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
