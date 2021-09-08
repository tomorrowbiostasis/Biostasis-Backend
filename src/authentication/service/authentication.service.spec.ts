import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationService } from './authentication.service';
import { DICTIONARY } from '../../common/constant/dictionary.constant';
import { configMock } from '../../../test/mock/config.mock';
import { cognitoIdentityServiceMock } from '../../../test/mock/cognito-identity-service.mock';
import * as AWS from 'aws-sdk';

describe('AuthenticationService', () => {
  let service: AuthenticationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        {
          provide: DICTIONARY.CONFIG,
          useValue: configMock,
        },
        {
          provide: AWS.CognitoIdentityServiceProvider,
          useValue: cognitoIdentityServiceMock,
        },
      ],
    }).compile();

    service = module.get<AuthenticationService>(AuthenticationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
