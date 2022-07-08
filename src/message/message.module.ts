import { forwardRef, Module } from '@nestjs/common';
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
import { TriggerTimeSlotModule } from '../trigger-time-slot/trigger-time-slot.module';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config/default';

@Module({
  imports: [
    forwardRef(() => NotificationModule),
    forwardRef(() => UserModule),
    ContactModule,
    forwardRef(() => QueueModule),
    forwardRef(() => TriggerTimeSlotModule),
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  controllers: [
    SendSMSController,
    SendEmergencyMessageController,
    CancelEmergencyMessageController,
  ],
  providers: [ConfigProvider, MessageService, FirebaseProvider],
  exports: [MessageService],
})
export class MessageModule {}
