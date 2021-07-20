import { UserEntity } from '../../user/entity/user.entity';

export const getFullName = (name: string, surname: string): string =>
  `${name || ''} ${surname || ''}`.trim();
