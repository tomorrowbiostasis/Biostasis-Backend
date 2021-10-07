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
    data: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    const payload = {
      notification: {
        title: data.title,
        body: data.message,
      },
      data: {
        source: 'backend',
        type: data.type,
      },
    };

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
          this.logger.log(result, JSON.stringify(payload));

          return result;
        }

        throw result;
      })
      .catch((error) => {
        this.logger.error(error, JSON.stringify(payload), deviceId);
      });
  }
}
