import { Process, Processor } from '@nestjs/bull';
import { Logger, Inject } from '@nestjs/common';
import { Job } from 'bull';
import { QUEUE } from '../constant/queue.constant';
import { NotificationService } from '../../notification/service/notification.service';
import { BasicConsumer } from './basic.consumer';
import { PROCESS } from '../constant/process.constant';
import { TimeSlotRepository } from '../../trigger-time-slot/repository/time-slot.repository';
import * as moment from 'moment';
import { MessageService } from '../service/message.service';

@Processor(QUEUE.MESSAGE)
export class MessageConsumer extends BasicConsumer {
  constructor(
    private notificationService: NotificationService,
    private readonly messageService: MessageService,
    @Inject(TimeSlotRepository)
    private readonly timeSlotRepository: TimeSlotRepository
  ) {
    super(new Logger(MessageConsumer.name));
  }

  @Process(PROCESS.EMAIL)
  async handleEmailProcess(job: Job) {
    this.notificationService.sendEmail(job.data, true);
  }

  @Process(PROCESS.SMS)
  async handleSmsProcess(job: Job) {
    this.notificationService.sendSms(job.data, true);
  }

  @Process(PROCESS.EMERGENCY)
  async handleEmergencyProcess(job: Job) {
    const [, userId] = job.id.toString().split('_');
    const timeSlots = await this.timeSlotRepository.findActiveTimeSlots(userId);

    if (timeSlots.length > 0) {
      const time = await this.timeSlotRepository.getCurrentTime();

      return this.messageService.addJobToQueue(
        PROCESS.EMERGENCY,
        job.data,
        Math.ceil(
          moment
            .duration(moment(timeSlots[0].to).diff(moment(time[0].now)))
            .asSeconds()
        ) * 1000,
        `${PROCESS.EMERGENCY}_${userId}_${moment().valueOf()}`
      );
    }

    if (job.data.sms) {
      this.notificationService.sendSms(job.data.sms, true);
    }

    if (job.data.email) {
      this.notificationService.sendEmail(job.data.email, true);
    }
  }
}
