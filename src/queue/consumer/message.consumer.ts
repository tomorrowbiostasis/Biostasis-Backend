import { Process, Processor } from '@nestjs/bull';
import { Logger, Inject } from '@nestjs/common';
import { Job } from 'bull';
import { QUEUE } from '../constant/queue.constant';
import { NotificationService } from '../../notification/service/notification.service';
import { BasicConsumer } from './basic.consumer';
import { PROCESS } from '../constant/process.constant';

@Processor(QUEUE.MESSAGE)
export class MessageConsumer extends BasicConsumer {
  constructor(private notificationService: NotificationService) {
    super(new Logger(MessageConsumer.name));
  }

  @Process(PROCESS.EMAIL)
  async handleEmailProcess(job: Job) {
    this.notificationService.sendEmail({
      ...job.data,
      isFromQueue: true,
    });
  }

  @Process(PROCESS.SMS)
  async handleSmsProcess(job: Job) {
    try {
      await this.notificationService.sendSms({ ...job.data, isFromQueue: true });

      this.logger.log(
        `[handleSmsProcess 1] sms process handled`,
        JSON.stringify(job.data),
      );
    } catch(error) {
      this.logger.error(
        `[handleSmsProcess 2] Exception during handling sms process:`,
        JSON.stringify(job.data),
        JSON.stringify(error),
      );
    }
  }

  @Process(PROCESS.EMERGENCY)
  async handleEmergencyProcess(job: Job) {
    try {
      const [, userId] = job.id.toString().split('_');

      if (job.data.sms) {
        await this.notificationService.sendSms({ ...job.data.sms, isFromQueue: true });
      }

      if (job.data.email) {
        await this.notificationService.sendEmail({
          data: job.data.email,
          isFromQueue: true,
          emergencyMessage: true,
          userId: userId,
        });
      }

      this.logger.log(
        `[handleSmsProcess 3] emergency process handled`,
        JSON.stringify(job.data),
      );
    } catch(error) {
      this.logger.error(
        `[handleSmsProcess 4] Exception during handling emergency process:`,
        JSON.stringify(job.data),
        JSON.stringify(error),
      );
    }
  }
}
