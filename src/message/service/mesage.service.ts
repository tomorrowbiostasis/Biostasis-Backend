import { Inject, Injectable, Logger } from '@nestjs/common';
import { UserService } from '../../user/service/user.service';
import { DICTIONARY } from '../constant/dictionary.constant';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);

  constructor(
    @Inject(DICTIONARY.FIREBASE)
    private readonly firebase,
    private readonly userService: UserService
  ) { }

  // async sendMessageToDevice(
  //   deviceId: string,
  //   data: Record<string, string>
  // ): Promise<Record<string, unknown>> {
  //   if (!deviceId) {
  //     return;
  //   }

  //   const user = await this.userService.findByDeviceId(deviceId);

  //   if (user?.profile?.allowNotifications === false) {
  //     return;
  //   }

  //   const payload: Record<string, Record<string, string>> = {
  //     notification: {
  //       title: data.title,
  //       body: data.message,
  //     },
  //     data: {
  //       source: 'backend',
  //       type: data.type,
  //     },
  //   };

  //   if (data.sound) {
  //     payload.notification.sound = data.sound;
  //   }

  //   return this.firebase
  //     .messaging()
  //     .sendToDevice(
  //       deviceId,
  //       {
  //         ...payload,
  //       },
  //       {
  //         priority: 'high',
  //       }
  //     )
  //     .then((result) => {
  //       if (result.successCount === 1) {
  //         Logger.log(`Push notification has been sent: `, JSON.stringify({ deviceId, ...payload }));

  //         return result;
  //       }

  //       Logger.error(`Push notification has NOT been sent: `, JSON.stringify({ deviceId, ...payload }));

  //       throw result;
  //     })
  //     .catch((error) => {
  //       this.logger.error(error, JSON.stringify(payload), deviceId);
  //     });
  // }

  async sendMessageToDevice(
    deviceId: string,
    data: Record<string, string>,
    mode: 'normal' | 'silent' = 'normal'
  ): Promise<void> {
    if (!deviceId) return;

    const user = await this.userService.findByDeviceId(deviceId);
    if (user?.profile?.allowNotifications === false) return;

    if (mode === 'normal') {
      const payload: any = {
        notification: {
          title: data.title,
          body: data.message,
          sound: data.sound || undefined,
        },
        data: {
          source: 'backend',
          type: data.type || '',
        },
      };

      try {
        const result = await this.firebase.messaging().sendToDevice(deviceId, payload, { priority: 'high' });
        this.logger.log(`Normal push sent: ${JSON.stringify({ deviceId, ...payload })}`);
      } catch (error) {
        this.logger.error(error, `Failed normal push: ${JSON.stringify(payload)}`, deviceId);
      }
    } else if (mode === 'silent') {
      const payload: any = {
        data: {
          source: 'backend',
          type: data.type || '',
          ...data,
        },
        apns: {
          headers: {
            'apns-priority': '5',
            'apns-push-type': 'background',
          },
          payload: {
            aps: { 'content-available': 1 },
          },
        },
      };

      try {
        await this.firebase.messaging().sendToDevice(deviceId, payload, { priority: 'normal' });
        this.logger.log(`Silent push sent: ${JSON.stringify({ deviceId, ...payload })}`);
      } catch (error) {
        this.logger.error(error, `Failed silent push: ${JSON.stringify(payload)}`, deviceId);
      }
    }
  }
}
