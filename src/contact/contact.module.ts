import { Module } from '@nestjs/common';
import { ContactService } from './service/contact.service';
import { ConfigProvider } from '../common/provider/config.provider';
import { ContactRepositoryProvider } from './provider/contact-repository.provider';
import { AddContactController } from './controller/add-contact.controller';

@Module({
  controllers: [AddContactController],
  providers: [ContactService, ConfigProvider, ContactRepositoryProvider],
  exports: [ContactService],
})
export class ContactModule {}
