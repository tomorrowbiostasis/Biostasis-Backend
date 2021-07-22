import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { UpdateResult } from 'typeorm';
import { UserRepository } from '../repository/user.repository';
import { UserEntity } from '../entity/user.entity';
import {
  UPDATE_USER_EMAIL_FAILED,
  USER_NOT_FOUND,
  SAVE_USER_FAILED,
} from '../../common/error/keys';
import { CustomError } from '../../common/error/custom-error';

@Injectable()
export class UserService {
  constructor(
    @Inject(UserRepository) private readonly userRepository: UserRepository
  ) {}

  findById(id: string): Promise<UserEntity> {
    return this.userRepository.findById(id);
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
        throw new CustomError(SAVE_USER_FAILED, error);
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
        throw new CustomError(UPDATE_USER_EMAIL_FAILED, error);
      });
  }
}
