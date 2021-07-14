import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { ProfileService } from './service/profile.service';
import { CognitoIdentityServiceProvider } from '../common/provider/cognito-identity-service.provider';
import { ConfigProvider } from '../common/provider/config.provider';
import { UserRepositoryProvider } from './provider/user-repository.provider';
import { ProfileRepositoryProvider } from './provider/profile-repository.provider';
import { UpdateUserProfileController } from './controller/update-user-profile.controller';

@Module({
  controllers: [UpdateUserProfileController],
  providers: [
    UserService,
    ProfileService,
    CognitoIdentityServiceProvider,
    ProfileRepositoryProvider,
    ConfigProvider,
    UserRepositoryProvider,
  ],
  exports: [UserService],
})
export class UserModule {}
