import { Inject, Injectable, Logger } from "@nestjs/common";
import { Cron, NestSchedule } from "nest-schedule";
import { PositiveInfoRepository } from "../user/repository/positive-info.repository";
import { MessageService } from "../message/service/mesage.service";
import { ConfigService } from "@nestjs/config";
import { DICTIONARY } from "../common/constant/dictionary.constant";
import { NotificationService } from "../notification/service/notification.service";
import { getNameOrEmail } from "../common/helper/get-name-or-email";
import { ProfileRepository } from "../user/repository/profile.repository";
import * as moment from "moment";
import { MESSAGE_TYPE } from "../message/constant/message-type.constant";
import { TriggerTimeSlotService } from "../trigger-time-slot/service/trigger-time-slot.service";
import { numberToDaysOfWeek } from "../trigger-time-slot/enum/days-of-week.enum";
import { getTimeFromDate } from "../common/helper/get-time-from-date";

@Injectable()
export class SchedulerService extends NestSchedule {
  private readonly logger = new Logger(SchedulerService.name);
  constructor(
    @Inject(DICTIONARY.CONFIG) private readonly config: ConfigService,
    @Inject(PositiveInfoRepository)
    private readonly positiveInfoRepository: PositiveInfoRepository,
    private readonly messageService: MessageService,
    private readonly notificationService: NotificationService,
    private readonly profileRepository: ProfileRepository,
    private readonly triggerTimeSlotService: TriggerTimeSlotService,
  ) {
    super();
  }

  @Cron("0 */5 * * * *")
  async informAboutTimeSlots() {
    const slots = (await this.triggerTimeSlotService.getSlotsToInform()) as any[];

    for (let slot of slots) {
      if (Array.isArray(slot) && slot.length > 0) slot = slot[0];

      slot.now = new Date().toISOString().slice(0,19) + '.000Z';

      const nowTime = moment(slot.now).format('HH:mm');
      const fromTime = moment(slot.ts_from).format('HH:mm')
      const toTime = moment(slot.ts_to).format('HH:mm')
      const leftThresholdTime = moment(slot.leftThreshold).format('HH:mm')
      const rightThresholdTime = moment(slot.rightThreshold).format('HH:mm')

      Logger.log(`Processing slot ${slot.ts_from ? 'specific time' : 'pause'}: `);
      Logger.log(JSON.stringify(slot));
      Logger.log(JSON.stringify({
        nowTime,
        fromTime,
        toTime,
        leftThresholdTime,
        rightThresholdTime
      }));

      if (slot.ts_from && nowTime <= leftThresholdTime && nowTime > fromTime) {
        const day = numberToDaysOfWeek.get(parseInt(slot.dayOfWeek));
        const from = moment(slot.ts_from).format('HH:mm');
        const to = moment(slot.ts_to).format('HH:mm');

        this.messageService.sendMessageToDevice(slot.u_device_id, {
          title: 'Biostasis automated system is disabled',
          message: `[BE] The system is paused on ${day} from ${from} to ${to}`,
          type: MESSAGE_TYPE.TIME_SLOT_NOTIFICATION,
        });

        Logger.log(`Specific time slot started id: ${slot.ts_id}`, JSON.stringify(slot));

        continue;
      }

      const shouldProceedSpecific = slot.ts_from && nowTime >= rightThresholdTime && nowTime < toTime;
      const shouldProceedPause = !slot.ts_from && slot.now >= slot.rightThreshold && slot.now < slot.ts_to;

      if (!shouldProceedSpecific && !shouldProceedPause) {
        Logger.log(`Time slot has been ignored`);

        continue;
      }

      Logger.log(`Time slot is ending id: ${slot.ts_id}`, JSON.stringify(slot));

      this.messageService.sendMessageToDevice(slot.u_device_id, {
        title: 'Biostasis automated system will resume',
        message: '[BE] The system will resume according to your normal settings',
        type: MESSAGE_TYPE.TIME_SLOT_NOTIFICATION,
      });
    }
  }

  @Cron("0 */5 * * * *")
  async checkRegularPositiveInfo() {
    await this.sendRegularPushNotification();
    await this.sendSmsDueToLackOfPositiveInfo(true);
    await this.sendAlertDueToLackOfPositiveInfo(true);
    await this.triggerEmergencyMessage(true);
  }

  async sendRegularPushNotification() {
    if (!this.shouldStartEscalation()) {
      return;
    }

    const profiles =
      await this.profileRepository.findWhereRegularNotificationIsNeeded();

    const operations = [], userIds = [];

    for (const profile of profiles) {
      const activeSlot = await this.triggerTimeSlotService.getActiveTimeSlot(profile.userId);

      if (activeSlot) {
        await this.positiveInfoRepository.postponeBySlotTime(profile.userId, activeSlot.to as any);
        continue;
      }

      this.logger.log(`[TIME BASED] Escalation started for ${profile.userId} at ${new Date().toISOString()}. Step: push notification.`);

      operations.push(
        this.messageService.sendMessageToDevice(profile.deviceId, {
          title: this.config.get("firebase.notification.title"),
          message: this.config.get("firebase.notification.message.regular"),
          type: MESSAGE_TYPE.EMERGENCY_TIME_BASED_CHECK,
        })
      );

      userIds.push(profile.userId);
    }

    if (operations.length > 0) {
      Promise.all(operations);
      await Promise.all([
        await this.positiveInfoRepository.setPushNotificationTime(
          userIds,
          this.config.get(
            "queue.sendAfterTime.smsIfNoPositiveInfoAfterPushNotification"
          )
        ),
        await this.profileRepository.setRegularNotificationTime(userIds),
      ]);
    }
  }

  @Cron("0 */5 * * * *")
  async checkNotRegularPositiveInfo() {
    await this.sendPushNotificationDueToLackOfPositiveInfo();
    await this.sendSmsDueToLackOfPositiveInfo(false);
    await this.sendAlertDueToLackOfPositiveInfo(false);
    await this.triggerEmergencyMessage(false);
  }

  async sendPushNotificationDueToLackOfPositiveInfo() {
    if (!this.shouldStartEscalation()) {
      return;
    }

    const expiredInformation =
      await this.positiveInfoRepository.findExpiredInformation();

    const operations = [], userIds = [];

    for (const information of expiredInformation) {
      const activeSlot = await this.triggerTimeSlotService.getActiveTimeSlot(information.user.id);

      if (activeSlot) {
        await this.positiveInfoRepository.postponeBySlotTime(information.user.id, activeSlot.to as any);
        continue;
      }

      this.logger.log(`[PULSE BASED] Escalation started for ${information.userId} at ${new Date().toISOString()}. Step: push notification (setPushNotificationTime).`);

      operations.push(
        this.messageService.sendMessageToDevice(information.user.deviceId, {
          title: this.config.get("firebase.notification.title"),
          message: this.config
            .get("firebase.notification.message.pulseBased")
            .replace("{minutes}", information.minutesToNext),
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
          "queue.sendAfterTime.smsIfNoPositiveInfoAfterPushNotification"
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
      this.logger.log(`Escalation continues for ${item.userId} at ${new Date().toISOString()}. Step: sms.`);

      this.notificationService.sendSms({
        data: this.notificationService.prepareSmsData(
          `${item.user.profile.prefix}${item.user.profile.phone}`,
          this.config
            .get("firebase.sms")
            .replace("{domain}", this.config.get("backend.url"))
        ),
        isPositiveInfoQuestion: true,
        userId: item.user.id,
        isFromQueue: true,
      });
    }
  }

  async sendAlertDueToLackOfPositiveInfo(regularPushNotification: boolean) {
    const smsWithoutReaction =
      await this.positiveInfoRepository.findSmsWithoutReaction(
        regularPushNotification,
        "alert_time"
      );
    const operations = [];
    const userIds = [];

    for (const item of smsWithoutReaction) {
      if (await this.triggerTimeSlotService.isActiveTimeSlot(item.userId)) {
        continue;
      }
      
      this.logger.log(`Escalation continues for ${item.userId} at ${new Date().toISOString()}. Step: alert  (clearAlertTime).`);

      operations.push(
        this.messageService.sendMessageToDevice(item.user.deviceId, {
          title: this.config.get("firebase.notification.title"),
          message: this.config.get("firebase.notification.message.alert"),
          type: MESSAGE_TYPE.EMERGENCY_ALERT,
          sound: this.config.get("firebase.notification.sound"),
        })
      );

      userIds.push(item.userId);
    }

    if (operations.length > 0) {
      Promise.all(operations);

      await this.positiveInfoRepository.clearAlertTime(userIds);
    }
  }

  async triggerEmergencyMessage(regularPushNotification: boolean) {
    const smsWithoutReaction =
      await this.positiveInfoRepository.findSmsWithoutReaction(
        regularPushNotification,
        "sms_time"
      );

    const operations = [], userIds = [];

    for (const item of smsWithoutReaction) {
      this.logger.log(`Escalation ends for ${item.userId} at ${new Date().toISOString()}. Step: emergency message (clearPositiveInfo and disable automatedEmergency).`);

      userIds.push(item.userId);

      for (const contact of item.user.contacts) {
        if (!contact.active) {
          continue;
        }

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
            {
              delayed: false,
              isFromQueue: true,
              locationUrl: item?.user?.profile?.location,
            }
          )
        );
      }

      if (userIds.length > 0) {
        await Promise.all([
          this.positiveInfoRepository.clearEverythingForUsers(userIds),
          this.profileRepository.disableAutomatedEmergencyForUsers(userIds),
          ...operations
        ]);
      }
    }
  }

  private shouldStartEscalation(): boolean {
    const hour = parseInt(moment().utc().format("H"));

    return hour >= parseInt(this.config.get("night.end")) &&
      hour < parseInt(this.config.get("night.start"));
  }
}
