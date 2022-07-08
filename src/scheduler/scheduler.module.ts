import { forwardRef, Module } from '@nestjs/common';
import { ScheduleModule } from 'nest-schedule';
import { SchedulerService } from './scheduler.service';
import { NotificationModule } from '../notification/notification.module';
import { UserModule } from '../user/user.module';
import { AppModule } from '../app.module';
import { ConfigProvider } from '../common/provider/config.provider';
import { MessageModule } from '../message/message.module';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config/default';
import { TriggerTimeSlotModule } from '../trigger-time-slot/trigger-time-slot.module';

@Module({
  imports: [
    ScheduleModule.register(),
    forwardRef(() => NotificationModule),
    UserModule,
    MessageModule,
    forwardRef(() => TriggerTimeSlotModule),
    forwardRef(() => AppModule),
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  providers: [SchedulerService, ConfigProvider],
  exports: [SchedulerService],
})
export class SchedulerModule {}
