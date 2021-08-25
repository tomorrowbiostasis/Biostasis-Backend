import { Module } from '@nestjs/common';
import { ConfigProvider } from '../common/provider/config.provider';
import { NotificationModule } from '../notification/notification.module';
import { UserModule } from '../user/user.module';
import { ContactModule } from '../contact/contact.module';
import { SendSMSController } from './controller/send-sms.controller';
import { SendEmergencyMessageController } from './controller/send-emergency-message.controller';
import { QueueModule } from '../queue/queue.module';
import { CancelEmergencyMessageController } from './controller/cancel-emergency-message.controller';
import { MessageService } from './service/mesage.service';
import { FirebaseProvider } from './provider/firebase.provider';

@Module({
  imports: [NotificationModule, UserModule, ContactModule, QueueModule],
  controllers: [
    SendSMSController,
    SendEmergencyMessageController,
    CancelEmergencyMessageController,
  ],
  providers: [ConfigProvider, MessageService, FirebaseProvider],
  exports: [MessageService],
})
export class MessageModule {}
