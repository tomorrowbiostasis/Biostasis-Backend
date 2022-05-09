import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { CognitoStrategy } from './strategy/cognito.strategy';
import { AuthenticationService } from './service/authentication.service';
import { CognitoIdentityServiceProvider } from '../common/provider/cognito-identity-service.provider';
import { ConfigProvider } from '../common/provider/config.provider';
import { UserModule } from '../user/user.module';
import { GetAccessTokenController } from './controller/get-access-token.controller';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config/default';
import { LogoutController } from './controller/logout.controller';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'cognito' }),
    forwardRef(() => UserModule),
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  controllers: [GetAccessTokenController, LogoutController],
  providers: [
    CognitoStrategy,
    AuthenticationService,
    CognitoIdentityServiceProvider,
    ConfigProvider,
  ],
  exports: [AuthenticationService],
})
export class AuthorizationModule {}
