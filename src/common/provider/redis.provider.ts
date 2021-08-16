import { FactoryProvider } from '@nestjs/common';
import { DICTIONARY } from '../constant/dictionary.constant';
import * as Redis from 'ioredis';
import { get } from 'config';

export const RedisProvider: FactoryProvider<any> = {
  provide: DICTIONARY.REDIS,
  useFactory: () => new Redis(get('redis')),
};
