import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, NestSchedule } from 'nest-schedule';
import { PositiveInfoRepository } from '../user/repository/positive-info.repository';
import { MessageService } from '../message/service/mesage.service';
import * as configLib from 'config';
import { DICTIONARY } from '../common/constant/dictionary.constant';

@Injectable()
export class SchedulerService extends NestSchedule {
  private readonly logger = new Logger(SchedulerService.name);
  constructor(
    @Inject(DICTIONARY.CONFIG) private readonly config: configLib.IConfig,
    @Inject(PositiveInfoRepository)
    private readonly positiveInfoRepository: PositiveInfoRepository,
    private readonly messageService: MessageService
  ) {
    super();
  }

  @Cron('* */5 * * * *')
  async checkPositiveInfo() {
    const expiredInformation =
      await this.positiveInfoRepository.findExpiredInformation();
    const operations = [];
    const userIds = [];

    for (const information of expiredInformation) {
      if (information.user.deviceId) {
        operations.push(
          this.messageService.sendSilentMessageToDevice(
            information.user.deviceId,
            { message: this.config.get('sms.isEverythingOk') }
          )
        );
        userIds.push(information.user.id);
      }
    }

    if (operations.length > 0) {
      await Promise.all(operations);
      await this.positiveInfoRepository.setPushNotificationTime(
        userIds,
        this.config.get(
          'queue.sendAfterTime.smsIfNoPositiveInfoAfterPushNotification'
        )
      );
    }
  }
}
