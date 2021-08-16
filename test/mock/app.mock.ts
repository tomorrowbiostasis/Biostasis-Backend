import { Test } from '@nestjs/testing';
import { AuthGuard } from '@nestjs/passport';
import { ExceptionsFilter } from '../../src/common/error/exception.filter';
import { authGuardMock } from './auth.guard.mock';
import { CognitoStrategy } from '../../src/authentication/strategy/cognito.strategy';
import { AppModule } from '../../src/app.module';
import * as AWS from 'aws-sdk';
import { awsCognitoMock } from './aws-cognito.mock';
import { DICTIONARY as NOTIFICATION_DI } from '../../src/notification/constant/dictionary.constant';
import { mailJetMock } from './mailjet.mock';
import * as twilioLibrary from 'twilio';
import { twilioMock } from './twilio.mock';
import { DICTIONARY as COMMON_DI } from '../../src/common/constant/dictionary.constant';
import { redisMock } from './redis.mock';
import { queueServiceMock } from './queue.service.mock';
import { QUEUE } from '../../src/queue/constant/queue.constant';

export const getTestApp = async () => {
  let app;

  const moduleFixture = await Test.createTestingModule({ imports: [AppModule] })
    .overrideProvider(CognitoStrategy)
    .useValue({})
    .overrideGuard(AuthGuard('cognito'))
    .useValue(authGuardMock)
    .overrideProvider(AWS.CognitoIdentityServiceProvider)
    .useValue(awsCognitoMock)
    .overrideProvider(NOTIFICATION_DI.MAIL_JET)
    .useValue(mailJetMock)
    .overrideProvider(twilioLibrary.Twilio)
    .useValue(twilioMock)
    .overrideProvider(COMMON_DI.REDIS)
    .useValue(redisMock)
    .overrideProvider(QUEUE.MESSAGE)
    .useValue(queueServiceMock)
    .compile();

  app = moduleFixture.createNestApplication();
  app.useGlobalFilters(new ExceptionsFilter());
  return app.init();
};
