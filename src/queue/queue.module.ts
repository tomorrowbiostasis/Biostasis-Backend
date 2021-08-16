import { Module, forwardRef } from '@nestjs/common';
import { ConfigProvider } from '../common/provider/config.provider';
import { MessageConsumer } from './consumer/message.consumer';
import { BullModule } from '@nestjs/bull';
import { QUEUE } from './constant/queue.constant';
import { QueueMessageProvider } from './provider/message-queue.provider';
import { NotificationModule } from '../notification/notification.module';
import { get } from 'config';

@Module({
  providers: [ConfigProvider, MessageConsumer, QueueMessageProvider],
  imports: [
    forwardRef(() => NotificationModule),
    BullModule.registerQueue({
      name: QUEUE.MESSAGE,
      defaultJobOptions: {
        removeOnComplete: true,
        attempts: get('queue.numberOfAttempts'),
      },
    }),
  ],
  exports: [QueueMessageProvider],
})
export class QueueModule {}
