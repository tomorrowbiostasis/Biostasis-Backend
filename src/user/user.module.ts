import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { CognitoIdentityServiceProvider } from '../common/provider/cognito-identity-service.provider';
import { ConfigProvider } from '../common/provider/config.provider';
import { UserRepositoryProvider } from '../common/provider/repository/user-repository.provider';

@Module({
  providers: [
    UserService,
    CognitoIdentityServiceProvider,
    ConfigProvider,
    UserRepositoryProvider,
  ],
  exports: [UserService],
})
export class UserModule {}
