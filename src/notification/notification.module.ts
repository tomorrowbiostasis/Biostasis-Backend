import { Module, forwardRef } from '@nestjs/common';
import { NotificationService } from './service/notification.service';
import { MailJetProvider } from './provider/mail-jet.provider';
import { ConfigProvider } from '../common/provider/config.provider';
import { TwilioProvider } from './provider/twilio.provider';
import { QueueModule } from '../queue/queue.module';
import { UserModule } from '../user/user.module';
import { FileModule } from '../file/file.module';

@Module({
  imports: [QueueModule, FileModule, forwardRef(() => UserModule)],
  providers: [
    NotificationService,
    MailJetProvider,
    ConfigProvider,
    TwilioProvider,
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
