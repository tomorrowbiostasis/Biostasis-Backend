import { EntityRepository, Repository } from 'typeorm';
import { UserEntity } from '../entity/user.entity';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  findById(id: string): Promise<UserEntity> {
    return this.findOne({ id });
  }
}
