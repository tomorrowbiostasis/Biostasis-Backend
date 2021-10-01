import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, NestSchedule } from 'nest-schedule';
import { PositiveInfoRepository } from '../user/repository/positive-info.repository';
import { MessageService } from '../message/service/mesage.service';
import * as configLib from 'config';
import { DICTIONARY } from '../common/constant/dictionary.constant';
import { NotificationService } from '../notification/service/notification.service';

@Injectable()
export class SchedulerService extends NestSchedule {
  private readonly logger = new Logger(SchedulerService.name);
  constructor(
    @Inject(DICTIONARY.CONFIG) private readonly config: configLib.IConfig,
    @Inject(PositiveInfoRepository)
    private readonly positiveInfoRepository: PositiveInfoRepository,
    private readonly messageService: MessageService,
    private readonly notificationService: NotificationService
  ) {
    super();
  }

  @Cron('0 */5 * * * *')
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

    const pushNotificationWithoutReaction =
      await this.positiveInfoRepository.findPushNotificationWithoutReaction();

    for (const item of pushNotificationWithoutReaction) {
      if (item.user?.profile?.prefix) {
        this.notificationService.sendSms(
          {
            data: this.notificationService.prepareSmsData(
              `${item.user.profile.prefix}${item.user.profile.phone}`,
              this.config.get('sms.isEverythingOk')
            ),
            isPositiveInfoQuestion: true,
            userId: item.user.id,
          },
          true
        );
      }
    }
  }
}
