import { Module } from '@nestjs/common';
import { NotificationService } from './service/notification.service';
import { MailJetProvider } from './provider/mail-jet.provider';
import { ConfigProvider } from '../common/provider/config.provider';
import { TwilioProvider } from './provider/twilio.provider';

@Module({
  providers: [
    NotificationService,
    MailJetProvider,
    ConfigProvider,
    TwilioProvider,
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
