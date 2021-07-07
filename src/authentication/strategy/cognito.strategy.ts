import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { ExtractJwt } from 'passport-jwt';
import { UserService } from '../../user/service/user.service';
import { PassportStrategy as Strategy } from '../strategy/passport.strategy';
import { AuthenticationService } from '../service/authentication.service';

@Injectable()
export class CognitoStrategy extends PassportStrategy(Strategy, 'cognito') {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthenticationService
  ) {
    super(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        auth: authService,
        logger: new Logger(CognitoStrategy.name),
      },
      async (request, token, done) => {
        let user = await this.userService.findById(token.sub);

        if (!user) {
          const userAttributes = await this.authService.getUserAttributes(
            token.sub
          );

          if (!userAttributes) {
            done(null);
            return;
          }

          await this.userService.saveUser(token.sub, userAttributes.email);
          user = await this.userService.findById(token.sub);
        }
        done(user, null);
      }
    );
  }
}
