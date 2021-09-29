import { EntityRepository, Repository } from 'typeorm';
import { Logger } from '@nestjs/common';
import { PositiveInfoEntity } from '../entity/positive-info.entity';

@EntityRepository(PositiveInfoEntity)
export class PositiveInfoRepository extends Repository<PositiveInfoEntity> {
  protected readonly logger = new Logger(PositiveInfoRepository.name);

  findByUserId(userId: string): Promise<{ id: number; now: string }> {
    return this.createQueryBuilder()
      .select('id')
      .addSelect('NOW()', 'now')
      .where('user_id = :userId', { userId })
      .execute()
      .then((data) => data.pop())
      .catch((error) => this.logger.error(error));
  }
}
