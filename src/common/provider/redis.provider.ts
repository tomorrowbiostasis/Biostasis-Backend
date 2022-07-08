import { FactoryProvider } from '@nestjs/common';
import { DICTIONARY } from '../constant/dictionary.constant';
import * as Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

export const RedisProvider: FactoryProvider<any> = {
  provide: DICTIONARY.REDIS,
  inject: [ConfigService],
  useFactory: (config: ConfigService) => new Redis(config.get('redis')),
};
