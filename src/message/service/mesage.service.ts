import { Inject, Injectable, Logger } from '@nestjs/common';
import { DICTIONARY } from '../constant/dictionary.constant';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);

  constructor(
    @Inject(DICTIONARY.FIREBASE)
    private readonly firebase
  ) {}

  async sendSilentMessageToDevice(
    deviceId: string,
    data: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    return this.firebase
      .messaging()
      .sendToDevice(
        deviceId,
        {
          notification: {
            empty: 'body',
          },
          data,
        },
        {
          priority: 'high',
        }
      )
      .then((result) => {
        if (result.successCount === 1) {
          this.logger.log(result);

          return result;
        }

        throw result;
      })
      .catch((error) => {
        this.logger.error(error, JSON.stringify(data), deviceId);
      });
  }
}
