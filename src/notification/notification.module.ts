import { Module, forwardRef } from '@nestjs/common';
import { NotificationService } from './service/notification.service';
import { MailJetProvider } from './provider/mail-jet.provider';
import { ConfigProvider } from '../common/provider/config.provider';
import { TwilioProvider } from './provider/twilio.provider';
import { QueueModule } from '../queue/queue.module';
import { UserModule } from '../user/user.module';
import { FileModule } from '../file/file.module';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config/default';

@Module({
  imports: [
    QueueModule,
    FileModule,
    forwardRef(() => UserModule),
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  providers: [
    NotificationService,
    MailJetProvider,
    ConfigProvider,
    TwilioProvider,
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
