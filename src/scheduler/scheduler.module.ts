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

@Module({
  imports: [
    ScheduleModule.register(),
    NotificationModule,
    UserModule,
    MessageModule,
    forwardRef(() => AppModule),
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  providers: [SchedulerService, ConfigProvider],
  exports: [SchedulerService],
})
export class SchedulerModule {}
