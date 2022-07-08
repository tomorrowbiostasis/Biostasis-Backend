import { Module, forwardRef } from '@nestjs/common';
import { ConfigProvider } from '../common/provider/config.provider';
import { MessageConsumer } from './consumer/message.consumer';
import { BullModule } from '@nestjs/bull';
import { QUEUE } from './constant/queue.constant';
import { QueueMessageProvider } from './provider/message-queue.provider';
import { NotificationModule } from '../notification/notification.module';
import configuration from '../config/default';
import { MessageService } from './service/message.service';
import { TriggerTimeSlotModule } from '../trigger-time-slot/trigger-time-slot.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [
    ConfigProvider,
    MessageConsumer,
    QueueMessageProvider,
    MessageService,
  ],
  imports: [
    forwardRef(() => NotificationModule),
    forwardRef(() => TriggerTimeSlotModule),
    BullModule.registerQueue({
      name: QUEUE.MESSAGE,
      defaultJobOptions: {
        removeOnComplete: true,
        attempts: configuration().queue.numberOfAttempts,
      },
    }),
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  exports: [QueueMessageProvider, MessageService],
})
export class QueueModule {}
