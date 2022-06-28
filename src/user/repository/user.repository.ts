import { Logger } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { UserEntity } from '../entity/user.entity';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  protected readonly logger = new Logger(UserRepository.name);

  findById(id: string): Promise<UserEntity> {
    return new Promise((resolve) => {
      this.findOne({ where: { id }, relations: ['profile'] })
        .then((data) => resolve(data))
        .catch((error) => this.logger.error(error));
    });
  }

  findByDeviceId(deviceId: string): Promise<UserEntity> {
    return new Promise((resolve) => {
      this.findOne({ where: { deviceId }, relations: ['profile'] })
        .then((data) => resolve(data))
        .catch((error) => this.logger.error(error));
    });
  }

  findByEmail(email: string): Promise<UserEntity> {
    return new Promise((resolve) => {
      this.findOne({ where: { email } })
        .then((data) => resolve(data))
        .catch((error) => this.logger.error(error));
    });
  }
}
