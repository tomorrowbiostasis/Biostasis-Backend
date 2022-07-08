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
        const userAttributes = await this.authService.getUserAttributes(
          token?.sub
        );

        if (!userAttributes) {
          done(null);
          return;
        }

        let user = await this.userService.findByEmail(userAttributes.email);

        if (!user) {
          await new Promise((resolve, reject) => {
            this.userService
              .saveUser(token?.sub, userAttributes.email)
              .then((result) => resolve(result))
              .catch((err) => {
                this.logger.error(JSON.stringify(err));
                reject(err);
              });
          }).catch(() => {
            done(null);
          });

          user = await this.userService.findByEmail(userAttributes.email);
        }

        done(user, null);
      }
    );
  }
}
