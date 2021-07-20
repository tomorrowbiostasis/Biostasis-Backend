import { Module } from '@nestjs/common';
import { NotificationService } from './service/notification.service';
import { MailJetProvider } from './provider/mail-jet.provider';
import { ConfigProvider } from '../common/provider/config.provider';

@Module({
  providers: [NotificationService, MailJetProvider, ConfigProvider],
  exports: [NotificationService],
})
export class NotificationModule {}
