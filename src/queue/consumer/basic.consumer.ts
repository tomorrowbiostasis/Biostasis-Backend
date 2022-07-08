import { OnQueueActive, OnQueueCompleted, OnQueueFailed } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

export class BasicConsumer {
  protected readonly logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  @OnQueueActive()
  onActive(job: Job): void { }

  @OnQueueCompleted()
  onComplete(job: Job): void { }

  @OnQueueFailed()
  onError(job: Job<any>, error: any): void {
    this.logger.error(
      `Failed job ${job.id} of type ${job.name}: ${error.message}`,
      error.stack
    );
  }
}
