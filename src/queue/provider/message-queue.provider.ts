import { FactoryProvider } from '@nestjs/common';
import { QUEUE } from '../constant/queue.constant';
import * as Queue from 'bull';
import { ConfigService } from '@nestjs/config';

export const QueueMessageProvider: FactoryProvider<any> = {
  provide: QUEUE.MESSAGE,
  inject: [ConfigService],
  useFactory: (config: ConfigService) =>
    Queue(QUEUE.MESSAGE, {
      redis: {
        password: config.get('redis.password'),
        port: config.get('redis.port'),
        host: config.get('redis.host'),
        tls: config.get('redis.disableTls') ? undefined : {
          servername: config.get('redis.host'),
          rejectUnauthorized: false,
        },
      },
      defaultJobOptions: {
        removeOnComplete: true,
        attempts: config.get('queue.numberOfAttempts'),
      },
    }),
};
