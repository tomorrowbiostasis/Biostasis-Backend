import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

export const CognitoIdentityServiceProvider = {
  provide: AWS.CognitoIdentityServiceProvider,
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    AWS.config.update({
      accessKeyId: config.get('authorization.accessKeyId') || undefined,
      secretAccessKey: config.get('authorization.secretAccessKey') || undefined,
      region: config.get('authorization.region'),
    });

    return new AWS.CognitoIdentityServiceProvider();
  },
};
