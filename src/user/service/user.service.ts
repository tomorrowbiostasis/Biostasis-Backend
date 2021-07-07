import { Inject, Injectable } from '@nestjs/common';
import { DICTIONARY } from '../../common/constant/dictionary.constant';
import { UserRepository } from '../repository/user.repository';
import { UserEntity } from '../entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject(DICTIONARY.USER) private readonly userRepository: UserRepository
  ) {}

  findById(id: string): Promise<UserEntity> {
    return this.userRepository.findById(id);
  }

  async saveUser(id: string, email: string): Promise<UserEntity> {
    return this.userRepository.save({
      id,
      email,
    });
  }
}
