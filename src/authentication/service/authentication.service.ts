import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import axios from 'axios';
import * as jwkToPem from 'jwk-to-pem';
import { DICTIONARY } from '../../common/constant/dictionary.constant';
import * as jwt from 'jsonwebtoken';
import { ICognito } from '../interface/cognito.interface';

@Injectable()
export class AuthenticationService {
  private pem: string;
  protected readonly logger = new Logger(AuthenticationService.name);

  constructor(
    @Inject(AWS.CognitoIdentityServiceProvider)
    private readonly cognito: AWS.CognitoIdentityServiceProvider,
    @Inject(DICTIONARY.CONFIG) private readonly config: ConfigService
  ) {}

  public async getPem() {
    return axios
      .get(this.config.get('authorization.jwks'))
      .then((res: any) => {
        const jwks = res.data.keys[1];

        if (res?.data?.keys.length < 1) {
          throw new Error('Missing JWKS keys');
        }

        this.pem = jwkToPem(jwks);
      })
      .catch((error) => {
        this.logger.error(error.response, 'AWS credentials are wrong');
      });
  }

  public async authenticate(token: string) {
    return new Promise(async (resolve, reject) => {
      if (!this.pem) {
        await this.getPem();
      }

      jwt.verify(token, this.pem, (error, decodedToken) => {
        if (error) {
          reject(error);
        }
        resolve(decodedToken);
      });
    });
  }

  getUserAttributes(tokenSub: string): Promise<any> {
    return new Promise((resolve) => {
      this.cognito.listUsers(
        {
          UserPoolId: this.config.get('authorization.userPoolId'),
          Filter: `sub = "${tokenSub}"`,
        },
        (error, data) => {
          if (error || data.Users.length !== 1) {
            Logger.error(error?.message || null, error?.stack);
            resolve(null);
            return;
          }

          const attributes = {};

          data.Users[0].Attributes.forEach(
            (attribute) => (attributes[attribute.Name] = attribute.Value)
          );

          resolve(attributes as ICognito);
        }
      );
    });
  }

  async getTokens(
    email: string,
    password: string
  ): Promise<AWS.CognitoIdentityServiceProvider.Types.InitiateAuthResponse> {
    return new Promise((resolve, reject) => {
      this.cognito.initiateAuth(
        {
          AuthFlow: 'USER_PASSWORD_AUTH',
          AuthParameters: {
            USERNAME: email,
            PASSWORD: password,
          },
          ClientId: this.config.get('authorization.clientId'),
        },
        (error, result) => {
          if (!error) {
            resolve(result);
            return;
          }
          reject(error);
        }
      );
    });
  }
}
