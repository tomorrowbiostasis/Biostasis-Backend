import {
  Inject,
  Injectable,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { Email } from 'node-mailjet';
import { ConfigService } from '@nestjs/config';
import { DICTIONARY } from '../../common/constant/dictionary.constant';
import {
  SEND_MAIL_FAILED,
  SEND_SMS_FAILED,
  EMAIL_AND_SMS_NOT_ALLOWED,
  EXPORT_DATA_FAILED,
  GET_FILE_CONTENT_FAILED,
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
import { ExportService } from '../../user/service/export.service';
import { FileRepository } from '../../file/repository/file.repository';
import { FileService } from '../../file/service/file.service';
import { PositiveInfoRepository } from '../../user/repository/positive-info.repository';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @Inject(DICTIONARY.CONFIG) private readonly config: ConfigService,
    @Inject(NOTIFICATION_DI.MAIL_JET) private readonly mailJet: Email.Client,
    @Inject(twilioLibrary.Twilio) private readonly twilio: twilioLibrary.Twilio,
    private readonly messageService: MessageService,
    private readonly exportService: ExportService,
    @Inject(FileRepository)
    private readonly fileRepository: FileRepository,
    private readonly fileService: FileService,
    @Inject(PositiveInfoRepository)
    private readonly positiveInfoRepository: PositiveInfoRepository
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
    params: {
      data: MessageListInstanceCreateOptions;
      isPositiveInfoQuestion?: boolean;
      isFromQueue?: boolean;
    }
  ) {
    if (!params.isPositiveInfoQuestion) {
      await this.messageService.addJobToQueue(
        PROCESS.SMS,
        params,
        this.config.get('queue.sendAfterTime.repeatTryingToSendMessage')
      );
    }

    if (params.isFromQueue) {
      this.logger.error(JSON.stringify(error), JSON.stringify(params));
    } else {
      throw new CustomError(SEND_SMS_FAILED, error);
    }
  }

  async sendSms(params: {
    data: MessageListInstanceCreateOptions;
    isPositiveInfoQuestion?: boolean;
    userId?: string;
    isFromQueue?: boolean;
  }): Promise<MessageInstance | void> {
    try {
      return this.twilio.messages
        .create(params.data)
        .then(async (result) => {
          if (result.errorMessage) {
            throw result;
          } else {
            this.logger.log(JSON.stringify(result));
          }

          if (params.isPositiveInfoQuestion && params.userId) {
            await this.positiveInfoRepository.setSmsTime(
              params.userId,
              this.config.get(
                'queue.sendAfterTime.triggerIfNoPositiveInfoAfterSms'
              )
            );
          }

          return result;
        })
        .catch(async (error) => {
          await this.handleSmsException(error, params);
        });
    } catch (error) {
      await this.handleSmsException(error, params);
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

  async prepareAttachmentWithExportedData(
    userId: string,
    isFromQueue: boolean
  ): Promise<Email.Attachment> {
    const content = await this.exportService.exportDataAsBase64(userId);

    if (!content) {
      this.logger.error('Exported content is empty');

      if (!isFromQueue) {
        throw new BadRequestException(EXPORT_DATA_FAILED);
      }
    }

    return {
      ContentType: 'application/vnd.ms-excel',
      Filename: 'exported-data.xls',
      Base64Content: content,
    };
  }

  async prepareEmergencyMessageAttachments(
    userId: string,
    isFromQueue: boolean
  ): Promise<Email.Attachment[]> {
    const files = await this.fileRepository.findManyByParams({ userId });
    const attachments: Email.Attachment[] = [];
    let content: string;

    for (const file of files) {
      content = await this.fileService.getFileAsBase64(file.key);

      if (!content && !isFromQueue) {
        throw new BadRequestException(GET_FILE_CONTENT_FAILED);
      }

      attachments.push({
        ContentType: file.mimeType,
        Filename: file.name,
        Base64Content: content,
      });
    }

    return attachments;
  }

  async sendEmail(params?: {
    data: Email.SendParams;
    isFromQueue?: boolean;
    exportedData?: boolean;
    emergencyMessage?: boolean;
    userId?: string;
  }): Promise<Email.Response> {
    let attachments: Email.Attachment[] = [];

    if (params?.exportedData) {
      const attachment = await this.prepareAttachmentWithExportedData(
        params?.userId,
        params?.isFromQueue
      );

      attachments.push(attachment);
    }

    if (params?.emergencyMessage) {
      attachments = await this.prepareEmergencyMessageAttachments(
        params.userId,
        params.isFromQueue
      );
    }

    params.data.Messages[0].Attachments = attachments;

    return this.mailJet
      .post('send', { version: 'v3.1' })
      .request(params.data)
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
          params,
          this.config.get('queue.sendAfterTime.repeatTryingToSendMessage')
        );

        if (params?.isFromQueue) {
          this.logger.error(JSON.stringify(error), JSON.stringify(params));
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
    data: SendEmergencyMessageDTO & { isFromQueue?: boolean }
  ): Promise<void> {
    if (user.profile?.emergencyEmailAndSms === false) {
      throw new BadRequestException(EMAIL_AND_SMS_NOT_ALLOWED);
    }

    let message =
      user.profile?.emergencyMessage ??
      this.config
        .get('emergencyTrigger.defaultMessage')
        .toString()
        .replace(
          '{name}',
          getNameOrEmail(user.profile?.name, user.profile?.surname, user.email)
        );

    let smsData: MessageListInstanceCreateOptions;

    if (contact.phone && user.email !== contact.email) {
      smsData = this.prepareSmsData(
        contact.phone,
        `${
          message === user.profile?.emergencyMessage
            ? `${this.config.get(
                'emergencyTrigger.customMessagePrefix'
              )} ${message}`
            : message
        } ${
          user.profile?.locationAccess === true && data.locationUrl
            ? data.locationUrl
            : ''
        }`.trim()
      );

      if (!data.delayed) {
        await this.sendSms({ data: smsData, isFromQueue: data.isFromQueue });
      }
    }

    const files = await this.fileRepository.findManyByParams({
      userId: user.id,
    });

    let params: Record<string, unknown> = {
      contactName: contact.name,
      username: getNameOrEmail(
        user.profile?.name,
        user.profile?.surname,
        user.email
      ),
      message:
        files.length > 0
          ? `${message} ${this.config.get(
              'emergencyTrigger.ifThereAreAttachments'
            )}`
          : message,
    };

    if (user.profile?.locationAccess === true) {
      params.locationUrl = data.locationUrl ?? '';
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
      await this.sendEmail({
        data: emailData,
        emergencyMessage: true,
        userId: user.id,
        isFromQueue: data.isFromQueue,
      });
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
