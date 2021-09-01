import { DICTIONARY } from '../constant/dictionary.constant';
import { get } from 'config';
import * as AWS from 'aws-sdk';

export const AWSS3Provider = {
  provide: DICTIONARY.S3,
  useFactory: () => {
    return new AWS.S3({
      accessKeyId: get('s3.accessKeyId'),
      signatureVersion: 'v4',
      secretAccessKey: get('s3.secretAccessKey'),
    });
  },
};
