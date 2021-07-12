import { getConnection } from 'typeorm';
import { UserEntity } from '../../src/user/entity/user.entity';

export const authGuardMock = {
  canActivate: async (context) => {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;

    if (token) {
      request.user = await getConnection()
        .getRepository(UserEntity)
        .findOne(token);

      if (!request.user) {
        return false;
      }
    }

    return true;
  },
};
