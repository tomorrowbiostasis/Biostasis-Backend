import { Module } from '@nestjs/common';
import { ConfigProvider } from '../common/provider/config.provider';
import { NotificationModule } from '../notification/notification.module';
import { UserModule } from '../user/user.module';
import { SendSMSController } from './controller/send-sms.controller';

@Module({
  imports: [NotificationModule, UserModule],
  controllers: [SendSMSController],
  providers: [ConfigProvider],
})
export class MessageModule {}
