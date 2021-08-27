import { DICTIONARY } from '../constant/dictionary.constant';
import { getConnection } from 'typeorm';

export const ConnectionProvider = {
  provide: DICTIONARY.CONNECTION,
  useFactory: () => getConnection(),
};
