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
    this.logger.log(
      `[handleSmsProcess 1] sms process handling started...`,
      JSON.stringify(job.data),
    );

    this.notificationService.sendSms({ ...job.data, isFromQueue: true });

    this.logger.log(
      `[handleSmsProcess 1] sms process handled`,
      JSON.stringify(job.data),
    );
  }

  @Process(PROCESS.EMERGENCY)
  async handleEmergencyProcess(job: Job) {
    this.logger.log(
      `[handleEmergencyProcess 1] handling emergency process...`,
      JSON.stringify(job.data),
    );

    const [, userId] = job.id.toString().split('_');

    if (job.data.sms) {
      this.logger.log(
        `[handleEmergencyProcess 2] handling sms send process...`,
        JSON.stringify(job),
      );

      this.notificationService.sendSms({ ...job.data.sms, isFromQueue: true });

      this.logger.log(
        `[handleEmergencyProcess 2] sms send process handled...`,
        JSON.stringify(job.data),
      );
    }

    if (job.data.email) {
      this.logger.log(
        `[handleEmergencyProcess 3] handling email send process...`,
        JSON.stringify(job),
      );

      this.notificationService.sendEmail({
        data: job.data.email,
        isFromQueue: true,
        emergencyMessage: true,
        userId: userId,
      });

      
      this.logger.log(
        `[handleEmergencyProcess 3] email send process handled...`,
        JSON.stringify({
          data: job.data.email,
          isFromQueue: true,
          emergencyMessage: true,
          userId: userId,
        }),
      );
    }

    this.logger.log(
      `[handleEmergencyProcess 1] emergency process handled`,
      JSON.stringify(job.data),
    );
  }
}
