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
    .compile();

  app = moduleFixture.createNestApplication();
  app.useGlobalFilters(new ExceptionsFilter());
  return app.init();
};
