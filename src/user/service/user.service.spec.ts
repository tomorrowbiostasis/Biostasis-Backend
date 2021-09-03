import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from '../repository/user.repository';
import { userRepositoryMock } from '../../../test/mock/user.repository.mock';
import * as AWS from 'aws-sdk';
import { DICTIONARY } from '../../common/constant/dictionary.constant';
import { configMock } from '../../../test/mock/config.mock';
import { cognitoIdentityServiceMock } from '../../../test/mock/cognito-identit-service.mock';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,

        {
          provide: UserRepository,
          useValue: userRepositoryMock,
        },
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

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
