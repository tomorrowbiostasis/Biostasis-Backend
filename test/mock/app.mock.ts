import { Test } from '@nestjs/testing';
import { AuthGuard } from '@nestjs/passport';
import { ExceptionsFilter } from '../../src/common/error/exception.filter';
import { authGuardMock } from './auth.guard.mock';
import { CognitoStrategy } from '../../src/authentication/strategy/cognito.strategy';
import { AppModule } from '../../src/app.module';

export const getTestApp = async () => {
  let app;

  const moduleFixture = await Test.createTestingModule({ imports: [AppModule] })
    .overrideProvider(CognitoStrategy)
    .useValue({})
    .overrideGuard(AuthGuard('cognito'))
    .useValue(authGuardMock)
    .compile();

  app = moduleFixture.createNestApplication();
  app.useGlobalFilters(new ExceptionsFilter());
  return app.init();
};
