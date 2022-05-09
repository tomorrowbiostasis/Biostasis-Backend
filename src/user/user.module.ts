import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { ProfileService } from './service/profile.service';
import { CognitoIdentityServiceProvider } from '../common/provider/cognito-identity-service.provider';
import { ConfigProvider } from '../common/provider/config.provider';
import { UserRepositoryProvider } from './provider/user-repository.provider';
import { ProfileRepositoryProvider } from './provider/profile-repository.provider';
import { UnconfirmedEmailRepositoryProvider } from './provider/unconfirmed-email-repository.provider';
import { UpdateUserProfileController } from './controller/update-user-profile.controller';
import { GetUserController } from './controller/get-user.controller';
import { ConfirmUserEmailController } from './controller/confirm-user-email.controller';
import { UnconfirmedEmailService } from './service/unconfirmed-email.service';
import { NotificationModule } from '../notification/notification.module';
import { SendTestMessageController } from './controller/send-test-message.controller';
import { GoogleLibPhoneNumberProvider } from '../common/provider/google-phone-number.provider';
import { QueueModule } from '../queue/queue.module';
import { DeleteUserController } from './controller/delete-account.controller';
import { ExportUserDataController } from './controller/export-user-data.controller';
import { ContactModule } from '../contact/contact.module';
import { ExportService } from './service/export.service';
import { TriggerTimeSlotModule } from '../trigger-time-slot/trigger-time-slot.module';
import { FileModule } from '../file/file.module';
import { UpdateUserDeviceIdentifierController } from './controller/update-user-device-id.controller';
import { NotePositiveInfoController } from './controller/note-positive-info.controller';
import { PositiveInfoRepositoryProvider } from './provider/positive-info-repository.provider';
import { PositiveInfoService } from './service/positive-info.service';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config/default';

@Module({
  imports: [
    NotificationModule,
    QueueModule,
    ContactModule,
    TriggerTimeSlotModule,
    FileModule,
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  controllers: [
    UpdateUserProfileController,
    GetUserController,
    ConfirmUserEmailController,
    SendTestMessageController,
    ExportUserDataController,
    DeleteUserController,
    UpdateUserDeviceIdentifierController,
    NotePositiveInfoController,
  ],
  providers: [
    UserService,
    ProfileService,
    CognitoIdentityServiceProvider,
    ProfileRepositoryProvider,
    UnconfirmedEmailRepositoryProvider,
    GoogleLibPhoneNumberProvider,
    PositiveInfoRepositoryProvider,
    ConfigProvider,
    UserRepositoryProvider,
    UnconfirmedEmailService,
    ExportService,
    PositiveInfoService,
  ],
  exports: [
    UserService,
    ProfileService,
    PositiveInfoService,
    ExportService,
    PositiveInfoRepositoryProvider,
    ProfileRepositoryProvider,
  ],
})
export class UserModule {}
