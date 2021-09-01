import { DICTIONARY } from '../constant/dictionary.constant';
import { get } from 'config';
import * as AWS from 'aws-sdk';

export const AWSCloudFrontSignerProvider = {
  provide: DICTIONARY.CLOUD_FRONT_SIGNER,
  useFactory: () => {
    return new AWS.CloudFront.Signer(
      get('cloudFrontSigner.accessKeyId'),
      get('cloudFrontSigner.privateKey')
    );
  },
};
