import { PositiveInfoEntity } from '../../src/user/entity/positive-info.entity';
import { getConnection } from 'typeorm';

export const getPositiveInfoByUserId = async (
  userId: string
): Promise<PositiveInfoEntity> => {
  return getConnection()
    .getRepository(PositiveInfoEntity)
    .findOne({ where: { userId } });
};
