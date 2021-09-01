import {
  Inject,
  Injectable,
  BadRequestException,
  Logger,
} from '@nestjs/common';
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
  private readonly logger = new Logger(UserService.name);

  constructor(
    @Inject(UserRepository) private readonly userRepository: UserRepository
  ) {}

  findByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.findByEmail(email);
  }

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
}
