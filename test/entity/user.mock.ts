import * as faker from 'faker';
import * as moment from 'moment';
import { UserEntity } from '../../src/user/entity/user.entity';
import { getConnection } from 'typeorm';
import { IUserData } from '../interface/user-data.interface';
import { omit } from '../../src/common/helper/omit';

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

export const getUserById = async (id: string): Promise<UserEntity> => {
  return getConnection()
    .getRepository(UserEntity)
    .findOne({ where: { id }, relations: ['profile'] });
};
