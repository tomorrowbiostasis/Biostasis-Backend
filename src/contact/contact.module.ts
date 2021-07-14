import { Module } from '@nestjs/common';
import { ContactService } from './service/contact.service';
import { ConfigProvider } from '../common/provider/config.provider';
import { ContactRepositoryProvider } from './provider/contact-repository.provider';
import { AddContactController } from './controller/add-contact.controller';
import { ContactListController } from './controller/contact-list.controller';
import { UpdateContactController } from './controller/update-contact.controller';
import { DeleteContactController } from './controller/delete-contact.controller';

@Module({
  controllers: [
    AddContactController,
    ContactListController,
    UpdateContactController,
    DeleteContactController,
  ],
  providers: [ContactService, ConfigProvider, ContactRepositoryProvider],
  exports: [ContactService],
})
export class ContactModule {}
