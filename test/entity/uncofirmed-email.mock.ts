import { UnconfirmedEmailEntity } from '../../src/user/entity/unconfirmed_email.entity';
import { getConnection } from 'typeorm';

export const getUnconfirmedEmailByUserId = async (
  userId: string
): Promise<UnconfirmedEmailEntity> => {
  return getConnection()
    .getRepository(UnconfirmedEmailEntity)
    .findOne({ where: { userId } });
};
