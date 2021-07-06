import * as config from 'config';
import { DICTIONARY } from '../constant/dictionary.constant';

export const ConfigProvider = {
  provide: DICTIONARY.CONFIG,
  useFactory: () => config,
};
