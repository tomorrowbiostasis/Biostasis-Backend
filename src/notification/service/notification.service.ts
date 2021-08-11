import {
  Inject,
  Injectable,
  BadRequestException,
  Logger,
} from '@nestjs/common';
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
import { getNameOrEmail } from '../../common/helper/get-name-or-email';
import { SendEmergencyMessageDTO } from '../../message/request/dto/send-emergency-message.dto';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

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
      .then((result) => {
        this.logger.log(JSON.stringify(result));

        return result;
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
      .then((result) => {
        this.logger.log(result.body);

        return result;
      })
      .catch((e) => {
        throw new CustomError(SEND_MAIL_FAILED, e);
      });
  }

  async sendEmergencyMessage(
    contact: {
      name: string;
      email: string;
      phone: string;
    },
    user: UserEntity,
    data: SendEmergencyMessageDTO
  ) {
    if (user.profile?.emergencyEmailAndSms === false) {
      throw new BadRequestException(EMAIL_AND_SMS_NOT_ALLOWED);
    }

    if (!user.profile?.emergencyMessage) {
      throw new BadRequestException(MESSAGE_IS_NEEDED);
    }

    if (contact.phone && user.email !== contact.email) {
      await this.sendSms(
        contact.phone,
        `${user.profile.emergencyMessage} ${
          user.profile?.locationAccess === true ? data.locationUrl : ''
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

    if (user.profile?.locationAccess === true) {
      params.locationUrl = data.locationUrl;
    }

    await this.sendEmail(
      getMailTemplateId(
        `EMERGENCY_MESSAGE_WITH${
          user.profile?.locationAccess !== true ? 'OUT' : ''
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
