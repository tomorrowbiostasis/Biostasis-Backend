import { Inject, Injectable, Logger } from '@nestjs/common';
import { deepStrictEqual } from 'assert';
import { DICTIONARY } from '../constant/dictionary.constant';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);

  constructor(
    @Inject(DICTIONARY.FIREBASE)
    private readonly firebase
  ) {}

  async sendMessageToDevice(
    deviceId: string,
    data: Record<string, string>
  ): Promise<Record<string, unknown>> {
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
          return result;
        }

        throw result;
      })
      .catch((error) => {
        this.logger.error(error, JSON.stringify(payload), deviceId);
      });
  }
}
