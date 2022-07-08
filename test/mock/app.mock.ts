import 'dotenv/config';

const env = process.env;

import { Test } from '@nestjs/testing';
import { AuthGuard } from '@nestjs/passport';
import { ExceptionsFilter } from '../../src/common/error/exception.filter';
import { authGuardMock } from './auth.guard.mock';
import { CognitoStrategy } from '../../src/authentication/strategy/cognito.strategy';
import { AppModule } from '../../src/app.module';
import * as AWS from 'aws-sdk';
import { cognitoIdentityServiceMock } from './cognito-identity-service.mock';
import { DICTIONARY as NOTIFICATION_DI } from '../../src/notification/constant/dictionary.constant';
import { mailJetMock } from './mailjet.mock';
import * as twilioLibrary from 'twilio';
import { twilioMock } from './twilio.mock';
import { DICTIONARY as COMMON_DI } from '../../src/common/constant/dictionary.constant';
import { redisMock } from './redis.mock';
import { queueServiceMock } from './queue.service.mock';
import { QUEUE } from '../../src/queue/constant/queue.constant';
import { DICTIONARY as MESSAGE_DI } from '../../src/message/constant/dictionary.constant';
import { firebaseMock } from './firebase.mock';
import { configMock } from './config.mock';
import { DICTIONARY as FILE_DI } from '../../src/file/constant/dictionary.constant';
import { s3Mock } from './s3.mock';
import { cloudFrontSignerMock } from './cloud-front-signer.mock';
import { SchedulerService } from '../../src/scheduler/scheduler.service';
import { googlePhoneNumberMock } from './google-phone-number.mock';

jest.mock('../../src/config/default', () => ({
  default: () => ({
    application: {
      call_timeout: 30,
      port: 5000,
      global_prefix: 'v1',
      timeoutForTests: 100000,
      encryptionKey: 'nrz4ms2rfppvj3jxlo285o0pbw6w2n63',
      encryptionIv: '24695113615289383436929733217552'
    },
    authorization: {
      accessKeyId: '',
      secretAccessKey: '',
      clientId: '',
      region: '',
      userPoolId: '',
      jwks: '',
    },
    mailJet: {
      apiKey: '',
      apiSecret: '',
      email: '',
      username: '',
    },
    twilio: {
      accountSid: '',
      authToken: '',
      phoneNumber: '',
    },
    redis: {
      connectionName: 'REDIS',
      host: '',
      schema: 'redis',
      user: 'redis',
      port: '',
      password: '',
      db: 0,
    },
    queue: {
      numberOfAttempts: 3,
      sendAfterTime: {
        repeatTryingToSendMessage: 60000,
        noConnectionToWatch: 300000,
        heartRateInvalid: 300000,
        smsIfNoPositiveInfoAfterPushNotification: 5,
        triggerIfNoPositiveInfoAfterSms: 15,
      },
    },
    night: {
      start: 20,
      end: 6,
    },
    database: {
      enable_ssl: false,
      charset: 'utf8mb4_unicode_ci',
      database: 'biostasis_test',
      host: env.DB_HOST,
      logging: false,
      password: env.DB_PASSWORD,
      port: env.DB_PORT,
      synchronize: false,
      type: 'mysql',
      username: env.DB_USERNAME,
    },
    backend: {
      url: '',
    },
    sms: {
      noConnectionToWatch: 'We have detected no connection with your watch.',
      heartRateInvalid: 'Your hear rate is invalid.',
    },
    firebase: {
      accountKey: {},
      notification: {
        title: 'Click to verify your health status now',
        message: {
          regular: 'Automated check from the Biostasis Emergency App',
          pulseBased: 'No pulse data for {minutes}+ minutes.',
        },
      },
      sms: 'Verify your health status now, click here {domain}/deeplink/are-you-ok to app page where health status can be verified. If you ignore this message, your emergency contacts will be notified in a few minutes.',
    },
    emergencyTrigger: {
      customMessagePrefix:
        'An emergency signal has been triggered with the following message:',
      defaultMessage:
        'This is an emergency signal from {name}. You are receiving this message because I may be in need of a cryopreservation.',
      ifThereAreAttachments: 'Additional information here and attached.',
    },
    s3: {
      bucket: '',
      accessKeyId: '',
      endpoint: '',
      region: '',
      secretAccessKey: '',
      fileSizeLimit: 10,
    },
    cloudFrontSigner: {
      accessKeyId: '',
      privateKey: '',
      url: '',
      validityTime: 200000,
    },
  }),
}));

export const getTestApp = async () => {
  let app;

  const moduleFixture = await Test.createTestingModule({ imports: [AppModule] })
    .overrideProvider(CognitoStrategy)
    .useValue({})
    .overrideProvider(SchedulerService)
    .useValue({})
    .overrideGuard(AuthGuard('cognito'))
    .useValue(authGuardMock)
    .overrideProvider(AWS.CognitoIdentityServiceProvider)
    .useValue(cognitoIdentityServiceMock)
    .overrideProvider(NOTIFICATION_DI.MAIL_JET)
    .useValue(mailJetMock)
    .overrideProvider(twilioLibrary.Twilio)
    .useValue(twilioMock)
    .overrideProvider(COMMON_DI.REDIS)
    .useValue(redisMock)
    .overrideProvider(COMMON_DI.CONFIG)
    .useValue(configMock)
    .overrideProvider(QUEUE.MESSAGE)
    .useValue(queueServiceMock)
    .overrideProvider(NOTIFICATION_DI.MAIL_JET)
    .useValue(mailJetMock)
    .overrideProvider(MESSAGE_DI.FIREBASE)
    .useValue(firebaseMock)
    .overrideProvider(FILE_DI.S3)
    .useValue(s3Mock)
    .overrideProvider(FILE_DI.CLOUD_FRONT_SIGNER)
    .useValue(cloudFrontSignerMock)
    .overrideProvider(FILE_DI.CLOUD_FRONT_SIGNER)
    .useValue(cloudFrontSignerMock)
    .overrideProvider(COMMON_DI.GOOGLE_PHONE_NUMBER)
    .useValue(googlePhoneNumberMock)
    .compile();

  app = moduleFixture.createNestApplication();
  app.useGlobalFilters(new ExceptionsFilter());
  return app.init();
};
