import { Module } from '@nestjs/common';
import { ContactService } from './service/contact.service';
import { ConfigProvider } from '../common/provider/config.provider';
import { ContactRepositoryProvider } from './provider/contact-repository.provider';
import { AddContactController } from './controller/add-contact.controller';
import { ContactListController } from './controller/contact-list.controller';

@Module({
  controllers: [AddContactController, ContactListController],
  providers: [ContactService, ConfigProvider, ContactRepositoryProvider],
  exports: [ContactService],
})
export class ContactModule {}
