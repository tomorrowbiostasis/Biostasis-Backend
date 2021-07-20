import { Inject, Injectable, Logger } from '@nestjs/common';
import { Email } from 'node-mailjet';
import * as configLib from 'config';
import { DICTIONARY } from '../../common/constant/dictionary.constant';
import { SEND_MAIL_FAILED } from '../../common/error/keys';
import { CustomError } from '../../common/error/custom-error';
import { DICTIONARY as NOTIFICATION_DI } from '../constant/dictionary.constant';

@Injectable()
export class NotificationService {
  constructor(
    @Inject(DICTIONARY.CONFIG) private readonly config: configLib.IConfig,
    @Inject(NOTIFICATION_DI.MAIL_JET) private readonly mailJet: Email.Client
  ) {}
  private escapeHtmlEntities(value: string) {
    return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  }

  sendEmail(
    templateId: number,
    variablesToEscapeAndSend: object,
    variablesToSend: object,
    to: { Email: string; Name?: string }[],
    wantToGetNotifications?: number | null
  ): Promise<Email.Response> {
    if (wantToGetNotifications === 0) {
      return;
    }

    const escapedVariables = {};
    for (const [key, value] of Object.entries(variablesToEscapeAndSend)) {
      escapedVariables[key] =
        typeof value === 'string' ? this.escapeHtmlEntities(value) : value;
    }
    const params = {
      Messages: [
        {
          From: {
            Email: this.config.get('mailJet.email'),
            Name: this.config.get('mailJet.username'),
          },
          To: to,
          TemplateID: templateId,
          TemplateLanguage: true,
          Variables:
            Object.keys(variablesToSend).length > 0
              ? { ...escapedVariables, ...variablesToSend }
              : escapedVariables,
        },
      ],
    };
    Logger.log(params, 'sendEmail - parameters');

    return this.mailJet
      .post('send', { version: 'v3.1' })
      .request(params)
      .catch((e) => {
        throw new CustomError(SEND_MAIL_FAILED, e);
      });
  }
}
