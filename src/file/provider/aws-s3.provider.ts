import { DICTIONARY } from '../constant/dictionary.constant';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

export const AWSS3Provider = {
  provide: DICTIONARY.S3,
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    return new AWS.S3({
      accessKeyId: config.get('s3.accessKeyId') || undefined,
      signatureVersion: 'v4',
      secretAccessKey: config.get('s3.secretAccessKey') || undefined,
    });
  },
};
