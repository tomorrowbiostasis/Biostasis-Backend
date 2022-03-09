import { DICTIONARY } from '../constant/dictionary.constant';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

export const AWSCloudFrontSignerProvider = {
  provide: DICTIONARY.CLOUD_FRONT_SIGNER,
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    return new AWS.CloudFront.Signer(
      config.get('cloudFrontSigner.accessKeyId'),
      config.get('cloudFrontSigner.privateKey')
    );
  },
};
