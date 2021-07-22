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

@Module({
  imports: [NotificationModule],
  controllers: [
    UpdateUserProfileController,
    GetUserController,
    ConfirmUserEmailController,
    SendTestMessageController,
  ],
  providers: [
    UserService,
    ProfileService,
    CognitoIdentityServiceProvider,
    ProfileRepositoryProvider,
    UnconfirmedEmailRepositoryProvider,
    ConfigProvider,
    UserRepositoryProvider,
    UnconfirmedEmailService,
  ],
  exports: [UserService],
})
export class UserModule {}
