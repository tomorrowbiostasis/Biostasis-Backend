import * as AWS from 'aws-sdk';
import { get } from 'config';

export const CognitoIdentityServiceProvider = {
  provide: AWS.CognitoIdentityServiceProvider,
  useFactory: () => {
    AWS.config.update({
      accessKeyId: get('authorization.accessKeyId'),
      secretAccessKey: get('authorization.secretAccessKey'),
      region: get('authorization.region'),
    });

    return new AWS.CognitoIdentityServiceProvider();
  },
};
