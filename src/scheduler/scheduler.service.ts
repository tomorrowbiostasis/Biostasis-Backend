import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, NestSchedule } from 'nest-schedule';
import { PositiveInfoRepository } from '../user/repository/positive-info.repository';
import { MessageService } from '../message/service/mesage.service';
import * as configLib from 'config';
import { DICTIONARY } from '../common/constant/dictionary.constant';
import { NotificationService } from '../notification/service/notification.service';
import { getNameOrEmail } from '../common/helper/get-name-or-email';
import { ProfileRepository } from '../user/repository/profile.repository';
import * as moment from 'moment';
import { MESSAGE_TYPE } from '../message/constant/message-type.constant';

@Injectable()
export class SchedulerService extends NestSchedule {
  private readonly logger = new Logger(SchedulerService.name);
  constructor(
    @Inject(DICTIONARY.CONFIG) private readonly config: configLib.IConfig,
    @Inject(PositiveInfoRepository)
    private readonly positiveInfoRepository: PositiveInfoRepository,
    private readonly messageService: MessageService,
    private readonly notificationService: NotificationService,
    private readonly profileRepository: ProfileRepository
  ) {
    super();
  }

  @Cron('0 */5 * * * *')
  async checkRegularPositiveInfo() {
    await this.sendRegularPushNotification();
    await this.sendSmsDueToLackOfPositiveInfo(true);
    await this.triggerEmergencyMessage(true);
  }

  async sendRegularPushNotification() {
    const profiles =
      await this.profileRepository.findWhereRegularNotificationIsNeeded();
    const operations = [];
    const userIds = [];
    let hour: number;

    for (const profile of profiles) {
      hour = parseInt(moment(profile.now).utc().format('H'));

      if (
        hour > parseInt(this.config.get('night.end')) &&
        hour < parseInt(this.config.get('night.start'))
      ) {
        operations.push(
          this.messageService.sendMessageToDevice(profile.deviceId, {
            title: this.config.get('firebase.notification.title'),
            message: this.config.get('firebase.notification.message.regular'),
            type: MESSAGE_TYPE.EMERGENCY_TIME_BASED_CHECK,
          })
        );
        userIds.push(profile.userId);
      }
    }

    if (operations.length > 0) {
      Promise.all(operations);
      await Promise.all([
        await this.positiveInfoRepository.setPushNotificationTime(
          userIds,
          this.config.get(
            'queue.sendAfterTime.smsIfNoPositiveInfoAfterPushNotification'
          )
        ),
        await this.profileRepository.setRegularNotificationTime(userIds),
      ]);
    }
  }

  @Cron('0 */5 * * * *')
  async checkNotRegularPositiveInfo() {
    await this.sendPushNotificationDueToLackOfPositiveInfo();
    await this.sendSmsDueToLackOfPositiveInfo(false);
    await this.triggerEmergencyMessage(false);
  }

  async sendPushNotificationDueToLackOfPositiveInfo() {
    const expiredInformation =
      await this.positiveInfoRepository.findExpiredInformation();
    const operations = [];
    const userIds = [];

    for (const information of expiredInformation) {
      operations.push(
        this.messageService.sendMessageToDevice(information.user.deviceId, {
          title: this.config.get('firebase.notification.title'),
          message: this.config
            .get('firebase.notification.message.pulseBased')
            .replace('{minutes}', information.minutesToNext),
          type: MESSAGE_TYPE.EMERGENCY_PULSE_BASED_CHECK,
        })
      );
      userIds.push(information.user.id);
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

  async sendSmsDueToLackOfPositiveInfo(regularPushNotification: boolean) {
    const pushNotificationWithoutReaction =
      await this.positiveInfoRepository.findPushNotificationWithoutReaction(
        regularPushNotification
      );

    for (const item of pushNotificationWithoutReaction) {
      this.notificationService.sendSms({
        data: this.notificationService.prepareSmsData(
          `${item.user.profile.prefix}${item.user.profile.phone}`,
          this.config
            .get('firebase.sms')
            .replace('{domain}', this.config.get('backend.url'))
        ),
        isPositiveInfoQuestion: true,
        userId: item.user.id,
        isFromQueue: true,
      });
    }
  }

  async triggerEmergencyMessage(regularPushNotification: boolean) {
    const smsWithoutReaction =
      await this.positiveInfoRepository.findSmsWithoutReaction(
        regularPushNotification
      );
    const operations = [];

    for (const item of smsWithoutReaction) {
      for (const contact of item.user.contacts) {
        operations.push(
          this.notificationService.sendEmergencyMessage(
            {
              name: getNameOrEmail(
                contact.name,
                contact.surname,
                contact.email
              ),
              email: contact.email,
              phone: contact.prefix
                ? `${contact.prefix}${contact.phone}`
                : null,
            },
            item.user,
            { delayed: false, isFromQueue: true, locationUrl: item.location }
          )
        );
      }

      if (operations.length > 0) {
        await Promise.all(operations);
        await this.positiveInfoRepository.setTriggerTime(item.user.id);
      }
    }
  }
}
