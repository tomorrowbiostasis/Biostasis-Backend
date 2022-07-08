import {
  Inject,
  Injectable,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import * as uuid from 'uuid';
import * as AWS from 'aws-sdk';
import { UnconfirmedEmailRepository } from '../repository/unconfirmed-email.repository';
import { UnconfirmedEmailEntity } from '../entity/unconfirmed_email.entity';
import { CustomError } from '../../common/error/custom-error';
import {
  SAVE_UNCONFIRMED_EMAIL_FAILED,
  UNCONFIRMED_EMAIL_NOT_FOUND,
  EMAIL_ALREADY_IN_USE,
  UPDATE_USER_EMAIL_FAILED,
} from '../../common/error/keys';
import { UserEntity } from '../../user/entity/user.entity';
import { DICTIONARY } from '../../common/constant/dictionary.constant';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UnconfirmedEmailService {
  private readonly logger = new Logger(UnconfirmedEmailService.name);

  constructor(
    @Inject(UnconfirmedEmailRepository)
    private readonly unconfirmedEmailRepository: UnconfirmedEmailRepository,
    @Inject(AWS.CognitoIdentityServiceProvider)
    private readonly cognito: AWS.CognitoIdentityServiceProvider,
    @Inject(DICTIONARY.CONFIG) private readonly config: ConfigService
  ) {}

  async saveUnconfirmedEmail(
    userId: string,
    email: string
  ): Promise<UnconfirmedEmailEntity> {
    return this.unconfirmedEmailRepository
      .save({ userId, code: uuid.v4(), email })
      .catch((error) => {
        this.logger.error(error);
        throw new BadRequestException(SAVE_UNCONFIRMED_EMAIL_FAILED);
      });
  }

  async findByCodeOrFail(code: string): Promise<UnconfirmedEmailEntity> {
    return this.unconfirmedEmailRepository.findByCode(code).then((data) => {
      if (!data) {
        throw new BadRequestException(UNCONFIRMED_EMAIL_NOT_FOUND);
      }

      return data;
    });
  }

  async changeUserEmailInCognito(user: UserEntity, email: string) {
    await new Promise((resolve, reject) => {
      this.cognito.adminUpdateUserAttributes(
        {
          UserPoolId: this.config.get('authorization.userPoolId'),
          Username: user.id,
          UserAttributes: [
            { Name: 'email', Value: email },
            { Name: 'email_verified', Value: 'true' },
          ],
        },
        (error, result) => {
          if (!error) {
            resolve(result);
            return;
          }
          reject(error);
        }
      );
    }).catch((error) => {
      throw new CustomError(
        error.code === 'AliasExistsException'
          ? EMAIL_ALREADY_IN_USE
          : UPDATE_USER_EMAIL_FAILED,
        error
      );
    });

    return this.unconfirmedEmailRepository.delete({ userId: user.id, email });
  }
}
