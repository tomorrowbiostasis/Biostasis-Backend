import { ConfigService } from '@nestjs/config';
import { DICTIONARY } from '../constant/dictionary.constant';

export const ConfigProvider = {
  provide: DICTIONARY.CONFIG,
  useExisting: ConfigService,
};
