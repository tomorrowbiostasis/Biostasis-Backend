import { EntityRepository, Repository } from 'typeorm';
import { UnconfirmedEmailEntity } from '../entity/unconfirmed_email.entity';

@EntityRepository(UnconfirmedEmailEntity)
export class UnconfirmedEmailRepository extends Repository<UnconfirmedEmailEntity> {
  findByUserId(userId: string): Promise<UnconfirmedEmailEntity[]> {
    return this.find({ where: { userId } });
  }

  findByCode(code: string): Promise<UnconfirmedEmailEntity> {
    return this.findOne({ where: { code }, relations: ['user'] });
  }
}
