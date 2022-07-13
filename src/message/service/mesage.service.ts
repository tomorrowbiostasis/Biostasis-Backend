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

  async sendMessageToDevice(
    deviceId: string,
    data: Record<string, string>
  ): Promise<Record<string, unknown>> {
    if (!deviceId) {
      return;
    }

    const user = await this.userService.findByDeviceId(deviceId);

    if (user?.profile?.allowNotifications === false) {
      return;
    }

    const payload: Record<string, Record<string, string>> = {
      notification: {
        title: data.title,
        body: data.message,
      },
      data: {
        source: 'backend',
        type: data.type,
      },
    };

    if (data.sound) {
      payload.notification.sound = data.sound;
    }

    return this.firebase
      .messaging()
      .sendToDevice(
        deviceId,
        {
          ...payload,
        },
        {
          priority: 'high',
        }
      )
      .then((result) => {
        if (result.successCount === 1) {
          Logger.log(`Push notification has been sent: `, JSON.stringify({ deviceId, ...payload }));

          return result;
        }

        Logger.error(`Push notification has NOT been sent: `, JSON.stringify({ deviceId, ...payload }));

        throw result;
      })
      .catch((error) => {
        this.logger.error(error, JSON.stringify(payload), deviceId);
      });
  }
}
