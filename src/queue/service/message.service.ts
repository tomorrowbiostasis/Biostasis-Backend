import {
  Inject,
  Injectable,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { QUEUE } from '../constant/queue.constant';
import * as Bull from 'bull';
import { Email } from 'node-mailjet';
import { MessageListInstanceCreateOptions } from 'twilio/lib/rest/api/v2010/account/message';
import { JOB_REMOVE_FAILED, GET_JOB_FAILED } from '../../common/error/keys';
import { PROCESS } from '../../queue/constant/process.constant';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);

  constructor(
    @Inject(QUEUE.MESSAGE)
    private messageQueue: Bull.Queue
  ) {}

  async findJobByUserId(userId: string): Promise<Bull.Job> {
    return this.messageQueue
      .getJob(`${PROCESS.EMERGENCY}_${userId}`)
      .catch((error) => {
        this.logger.error(JSON.stringify(error));
        throw new BadRequestException(GET_JOB_FAILED, error);
      });
  }

  async removeJobsByUserId(userId: string): Promise<void> {
    return this.messageQueue.removeJobs(`*_${userId}*`).catch((error) => {
      this.logger.error(JSON.stringify(error));
      throw new BadRequestException(JOB_REMOVE_FAILED, error);
    });
  }

  async addJobToQueue(
    jobName: string,
    params:
      | Email.SendParams
      | MessageListInstanceCreateOptions
      | Record<string, unknown>,
    delay: number,
    jobId?: string
  ): Promise<Bull.Job | void> {
    return this.messageQueue
      .add(jobName, params, {
        delay,
        jobId,
      })
      .catch((error) => this.logger.error(JSON.stringify(error)));
  }
}
