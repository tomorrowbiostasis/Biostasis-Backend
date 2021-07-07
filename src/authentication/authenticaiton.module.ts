import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { CognitoStrategy } from './strategy/cognito.strategy';
import { AuthenticationService } from './service/authentication.service';
import { CognitoIdentityServiceProvider } from '../common/provider/cognito-identity-service.provider';
import { ConfigProvider } from '../common/provider/config.provider';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'cognito' }),
    forwardRef(() => UserModule),
  ],
  providers: [
    CognitoStrategy,
    AuthenticationService,
    CognitoIdentityServiceProvider,
    ConfigProvider,
  ],
  exports: [AuthenticationService],
})
export class AuthorizationModule {}
