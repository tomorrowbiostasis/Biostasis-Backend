import { FactoryProvider } from '@nestjs/common';
import { QUEUE } from '../constant/queue.constant';
import * as Queue from 'bull';
import { get } from 'config';

export const QueueMessageProvider: FactoryProvider<any> = {
  provide: QUEUE.MESSAGE,
  useFactory: () =>
    Queue(QUEUE.MESSAGE, {
      redis: {
        password: get('redis.password'),
        port: get('redis.port'),
        host: get('redis.host'),
      },
      defaultJobOptions: {
        removeOnComplete: true,
        attempts: get('queue.numberOfAttempts'),
      },
    }),
};
