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
} from '../../common/error/keys';
import { CustomError } from '../../common/error/custom-error';
import { DICTIONARY as NOTIFICATION_DI } from '../constant/dictionary.constant';
import * as twilioLibrary from 'twilio';
import { UserEntity } from '../../user/entity/user.entity';
import { escapeHTML } from '../helper/escape-html';
import { getMailTemplateId } from '../helper/get-template-id';
import { getNameOrEmail } from '../../common/helper/get-name-or-email';
import { SendEmergencyMessageDTO } from '../../message/request/dto/send-emergency-message.dto';
import { MessageListInstanceCreateOptions } from 'twilio/lib/rest/api/v2010/account/message';
import { MessageInstance } from 'twilio/lib/rest/api/v2010/account/message';
import { MessageService } from '../../queue/service/message.service';
import { PROCESS } from '../../queue/constant/process.constant';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @Inject(DICTIONARY.CONFIG) private readonly config: configLib.IConfig,
    @Inject(NOTIFICATION_DI.MAIL_JET) private readonly mailJet: Email.Client,
    @Inject(twilioLibrary.Twilio) private readonly twilio: twilioLibrary.Twilio,
    private readonly messageService: MessageService
  ) {}

  prepareSmsData(
    to: string,
    message: string
  ): MessageListInstanceCreateOptions {
    return {
      from: this.config.get('twilio.phoneNumber'),
      to,
      body: message,
    };
  }

  async handleSmsException(
    error: Record<string, unknown>,
    params: MessageListInstanceCreateOptions,
    isFromQueue = false
  ) {
    await this.messageService.addJobToQueue(
      PROCESS.SMS,
      {
        params,
      },
      this.config.get('queue.sendAfterTime.repeatTryingToSendMessage')
    );

    if (isFromQueue) {
      this.logger.error(error, JSON.stringify(params));
    } else {
      throw new CustomError(SEND_SMS_FAILED, error);
    }
  }

  async sendSms(
    params: MessageListInstanceCreateOptions,
    isFromQueue = false
  ): Promise<MessageInstance | void> {
    try {
      return this.twilio.messages
        .create(params)
        .then((result) => {
          if (result.errorMessage) {
            throw result;
          } else {
            this.logger.log(JSON.stringify(result));
          }

          return result;
        })
        .catch(async (error) => {
          await this.handleSmsException(error, params, isFromQueue);
        });
    } catch (error) {
      await this.handleSmsException(error, params, isFromQueue);
    }
  }

  prepareEmailData(
    templateId: number,
    variablesToEscapeAndSend: object,
    variablesToSend: object,
    to: { Email: string; Name?: string }[],
    wantToGetNotifications?: number | null
  ): Email.SendParams {
    if (wantToGetNotifications === 0) {
      return;
    }

    const escapedVariables = {};
    for (const [key, value] of Object.entries(variablesToEscapeAndSend)) {
      escapedVariables[key] =
        typeof value === 'string' ? escapeHTML(value) : value;
    }

    return {
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
  }

  async sendEmail(
    params: Email.SendParams,
    isFromQueue = false
  ): Promise<Email.Response> {
    return this.mailJet
      .post('send', { version: 'v3.1' })
      .request(params)
      .then((result: any) => {
        if (result.body.Messages[0].Status !== 'success') {
          throw result.body;
        } else {
          this.logger.log(result.body);
        }

        return result;
      })
      .catch(async (error) => {
        await this.messageService.addJobToQueue(
          PROCESS.EMAIL,
          {
            params,
          },
          this.config.get('queue.sendAfterTime.repeatTryingToSendMessage')
        );

        if (isFromQueue) {
          this.logger.error(error, JSON.stringify(params));
        } else {
          throw new CustomError(SEND_MAIL_FAILED, error);
        }
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
  ): Promise<void> {
    if (user.profile?.emergencyEmailAndSms === false) {
      throw new BadRequestException(EMAIL_AND_SMS_NOT_ALLOWED);
    }

    const message =
      user.profile?.emergencyMessage ??
      this.config.get('emergencyTrigger.defaultMessage');

    let smsData: MessageListInstanceCreateOptions;

    if (contact.phone && user.email !== contact.email) {
      smsData = this.prepareSmsData(
        contact.phone,
        `${message} ${
          user.profile?.locationAccess === true ? data.locationUrl : ''
        }`.trim()
      );

      if (!data.delayed) {
        await this.sendSms(smsData);
      }
    }

    let params: Record<string, unknown> = {
      contactName: contact.name,
      userName: getNameOrEmail(
        user.profile?.name,
        user.profile?.surname,
        user.email
      ),
      message,
    };

    if (user.profile?.locationAccess === true) {
      params.locationUrl = data.locationUrl;
    }

    const emailData = this.prepareEmailData(
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

    if (!data.delayed) {
      await this.sendEmail(emailData);
    }

    if (data.delayed) {
      await this.messageService.addJobToQueue(
        PROCESS.EMERGENCY,
        {
          sms: smsData,
          email: emailData,
        },
        this.config.get(`queue.sendAfterTime.${data.messageType}`),
        `${PROCESS.EMERGENCY}_${user.id}`
      );
    }
  }
}
