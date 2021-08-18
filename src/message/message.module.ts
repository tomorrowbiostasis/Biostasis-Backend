import { Module } from '@nestjs/common';
import { ConfigProvider } from '../common/provider/config.provider';
import { NotificationModule } from '../notification/notification.module';
import { UserModule } from '../user/user.module';
import { ContactModule } from '../contact/contact.module';
import { SendSMSController } from './controller/send-sms.controller';
import { SendEmergencyMessageController } from './controller/send-emergency-message.controller';
import { QueueModule } from '../queue/queue.module';
import { CancelEmergencyMessageController } from './controller/cancel-emergency-message.controller';

@Module({
  imports: [NotificationModule, UserModule, ContactModule, QueueModule],
  controllers: [
    SendSMSController,
    SendEmergencyMessageController,
    CancelEmergencyMessageController,
  ],
  providers: [ConfigProvider],
})
export class MessageModule {}
