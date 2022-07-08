import * as util from 'util';
import * as passport from 'passport';
import { Logger, ForbiddenException } from '@nestjs/common';
import { UserEntity } from '../../user/entity/user.entity';
import { JwtFromRequestFunction } from 'passport-jwt';
import { AuthenticationService } from '../service/authentication.service';
import { MISSING_AUTHENTICATION_TOKEN } from '../../common/error/keys';

export class PassportStrategy {
  private fail;
  private readonly jwtFromRequest: JwtFromRequestFunction;
  private readonly verify: (request, token, done) => UserEntity;
  private success: (user, error) => UserEntity;
  private auth: AuthenticationService;
  protected readonly logger = new Logger(PassportStrategy.name);

  constructor(
    options: {
      jwtFromRequest: JwtFromRequestFunction;
      auth: AuthenticationService;
      logger: Logger;
    },
    verify: (request, token) => UserEntity
  ) {
    passport.Strategy.call(this);

    this.verify = verify;

    this.auth = options.auth;
    this.logger = options.logger;
    this.jwtFromRequest = options.jwtFromRequest;
  }

  async authenticate(request) {
    try {
      const token = this.jwtFromRequest(request);
      if (!token) {
        throw new ForbiddenException(MISSING_AUTHENTICATION_TOKEN);
      }

      const decodedToken = await this.auth
        .authenticate(token)
        .catch((error) => this.logger.error(error));

      return this.verify(request, decodedToken, this.success);
    } catch (e) {
      this.logger.error(e);
      return this.fail(e);
    }
  }
}

util.inherits(PassportStrategy, passport.Strategy);
