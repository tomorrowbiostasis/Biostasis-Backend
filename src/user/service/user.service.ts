import {
  Inject,
  Injectable,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { UpdateResult, DeleteResult } from 'typeorm';
import { UserRepository } from '../repository/user.repository';
import { UserEntity } from '../entity/user.entity';
import {
  UPDATE_USER_EMAIL_FAILED,
  USER_NOT_FOUND,
  SAVE_USER_FAILED,
  DELETE_USER_FROM_COGNITO_FAILED,
  DELETE_USER_FROM_DB_FAILED,
  UPDATE_USER_DEVICE_ID_FAILED,
} from '../../common/error/keys';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { DICTIONARY } from '../../common/constant/dictionary.constant';
import { PositiveInfoRepository } from '../repository/positive-info.repository';
import { ProfileRepository } from '../repository/profile.repository';
import { Encrypter } from '../../common/helper/encrypter';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @Inject(AWS.CognitoIdentityServiceProvider)
    private readonly cognito: AWS.CognitoIdentityServiceProvider,
    @Inject(DICTIONARY.CONFIG) private readonly config: ConfigService,
    @Inject(UserRepository) private readonly userRepository: UserRepository,
    private readonly positiveInfoRepository: PositiveInfoRepository,
    private readonly profileRepository: ProfileRepository,
  ) { }

  clearPositiveInfo(userId: string) {
    return Promise.all([
      this.positiveInfoRepository.clearEverythingForUsers([userId]),
      this.profileRepository.disableAutomatedEmergencyForUsers([userId]),
    ]);
  }

  findByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.findByEmail(Encrypter.encrypt(email));
  }

  findById(id: string): Promise<UserEntity> {
    return this.userRepository.findById(id);
  }

  findByDeviceId(deviceId: string): Promise<UserEntity> {
    return this.userRepository.findByDeviceId(deviceId);
  }

  async findByIdOrFail(id: string): Promise<UserEntity> {
    return this.findById(id).then((data) => {
      if (!data) {
        throw new BadRequestException(USER_NOT_FOUND);
      }

      return data;
    });
  }

  async saveUser(id: string, email: string): Promise<UserEntity> {
    return this.userRepository
      .save({
        id,
        email,
      })
      .catch((error) => {
        this.logger.error(error);
        throw new BadRequestException(SAVE_USER_FAILED);
      });
  }

  async updateUserEmail(id: string, email: string): Promise<UpdateResult> {
    return this.userRepository
      .update(
        {
          id,
        },
        { email }
      )
      .catch((error) => {
        this.logger.error(error);
        throw new BadRequestException(UPDATE_USER_EMAIL_FAILED);
      });
  }

  async updateUserDeviceId(
    userId: string,
    deviceId: string
  ): Promise<UpdateResult> {
    return this.userRepository
      .update(
        {
          id: userId,
        },
        { deviceId }
      )
      .catch((error) => {
        this.logger.error(error);
        throw new BadRequestException(UPDATE_USER_DEVICE_ID_FAILED);
      });
  }

  async deleteUser(user: UserEntity): Promise<DeleteResult> {
    await new Promise((resolve, reject) => {
      this.cognito.adminDeleteUser(
        {
          UserPoolId: this.config.get('authorization.userPoolId'),
          Username: user.id,
        },
        (error, result) => {
          if (!error) {
            resolve(result);
          }
          reject(error);
        }
      );
    }).catch((error) => {
      this.logger.error(error, JSON.stringify(user));
      throw new BadRequestException(DELETE_USER_FROM_COGNITO_FAILED, error);
    });

    return this.userRepository.delete(user.id).catch((error) => {
      this.logger.error(error);
      throw new BadRequestException(DELETE_USER_FROM_DB_FAILED, error);
    });
  }
}
