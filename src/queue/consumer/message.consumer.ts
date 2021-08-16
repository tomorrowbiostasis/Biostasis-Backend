import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { QUEUE } from '../constant/queue.constant';
import { NotificationService } from '../../notification/service/notification.service';
import { BasicConsumer } from './basic.consumer';

@Processor(QUEUE.MESSAGE)
export class MessageConsumer extends BasicConsumer {
  constructor(private notificationService: NotificationService) {
    super(new Logger(MessageConsumer.name));
  }

  @Process('email')
  async handleEmailProcess(job: Job) {
    this.notificationService.sendEmail(job.data, true);
  }

  @Process('sms')
  async handleSmsProcess(job: Job) {
    this.notificationService.sendSms(job.data, true);
  }
}
