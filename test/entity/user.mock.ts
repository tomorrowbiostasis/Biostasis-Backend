import * as faker from 'faker';
import { UserEntity } from '../../src/user/entity/user.entity';
import { getConnection } from 'typeorm';
import { IUserData } from '../interface/user-data.interface';

export const getUserStub = (data?: IUserData): UserEntity => {
  const user = new UserEntity();

  user.id = faker.datatype.uuid();
  user.email = data?.email ?? faker.internet.email();

  return user;
};

export const addUser = async (data?: IUserData): Promise<UserEntity> => {
  const user = getUserStub(data);

  return getConnection().getRepository(UserEntity).save(user);
};
