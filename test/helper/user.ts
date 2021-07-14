import { addUser } from '../entity/user.mock';
import { UserEntity } from '../../src/user/entity/user.entity';

export const initializeDataset = async (): Promise<{
  user: UserEntity;
}> => {
  const user = await addUser();

  return {
    user,
  };
};
