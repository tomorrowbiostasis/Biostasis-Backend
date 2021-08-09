import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { Email } from 'node-mailjet';
import * as configLib from 'config';
import { DICTIONARY } from '../../common/constant/dictionary.constant';
import {
  SEND_MAIL_FAILED,
  SEND_SMS_FAILED,
  EMAIL_AND_SMS_NOT_ALLOWED,
  MESSAGE_IS_NEEDED,
} from '../../common/error/keys';
import { CustomError } from '../../common/error/custom-error';
import { DICTIONARY as NOTIFICATION_DI } from '../constant/dictionary.constant';
import * as twilioLibrary from 'twilio';
import { UserEntity } from '../../user/entity/user.entity';
import { escapeHTML } from '../helper/escape-html';
import { getMailTemplateId } from '../helper/get-template-id';
import { getNameOrEmail } from '../../user/helper/get-name-or-email';
import { SendTestMessageDTO } from '../../user/request/dto/send-test-message.dto';

@Injectable()
export class NotificationService {
  constructor(
    @Inject(DICTIONARY.CONFIG) private readonly config: configLib.IConfig,
    @Inject(NOTIFICATION_DI.MAIL_JET) private readonly mailJet: Email.Client,
    @Inject(twilioLibrary.Twilio) private readonly twilio: twilioLibrary.Twilio
  ) {}

  async sendSms(to: string, message: string) {
    return this.twilio.messages
      .create({
        from: this.config.get('twilio.phoneNumber'),
        to,
        body: message,
      })
      .catch((e) => {
        throw new CustomError(SEND_SMS_FAILED, e);
      });
  }

  async sendEmail(
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
        typeof value === 'string' ? escapeHTML(value) : value;
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

    return this.mailJet
      .post('send', { version: 'v3.1' })
      .request(params)
      .catch((e) => {
        throw new CustomError(SEND_MAIL_FAILED, e);
      });
  }

  async sendEmergencyMessage(
    contact: {
      name: string;
      email: string;
    },
    user: UserEntity,
    data: SendTestMessageDTO
  ) {
    if (user.profile?.emergencyEmailAndSms === false) {
      throw new BadRequestException(EMAIL_AND_SMS_NOT_ALLOWED);
    }

    if (!user.profile?.emergencyMessage) {
      throw new BadRequestException(MESSAGE_IS_NEEDED);
    }

    if (user.profile?.phone && user.email !== contact.email) {
      await this.sendSms(
        `${user.profile.prefix}${user.profile.phone}`,
        `${user.profile.emergencyMessage} ${
          user.profile?.locationAccess !== false ? data.locationUrl : ''
        }`.trim()
      );
    }

    let params: Record<string, unknown> = {
      contactName: contact.name,
      userName: getNameOrEmail(
        user.profile?.name,
        user.profile?.surname,
        user.email
      ),
      message: user.profile.emergencyMessage,
    };

    if (user.profile?.locationAccess !== false) {
      params.locationUrl = data.locationUrl;
    }

    await this.sendEmail(
      getMailTemplateId(
        `EMERGENCY_MESSAGE_WITH${
          user.profile?.locationAccess === false ? 'OUT' : ''
        }_LOCATION`
      ),
      params,
      {},
      [
        {
          Email: contact.email,
        },
      ]
    );
  }
}
