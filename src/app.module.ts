import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorizationModule } from './authentication/authenticaiton.module';
import { UserModule } from './user/user.module';
import { ContactModule } from './contact/contact.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { get } from 'config';
import { NotificationModule } from './notification/notification.module';
import { MessageModule } from './message/message.module';
import { BullModule } from '@nestjs/bull';
import { QueueModule } from './queue/queue.module';
import { RedisProvider } from './common/provider/redis.provider';
import { TriggerTimeSlotModule } from './trigger-time-slot/trigger-time-slot.module';
import { FileModule } from './file/file.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...get('database'),
      entities: [`${__dirname}/**/*.entity{.ts,.js}`],
      migrationsRun: process.env.NODE_ENV === 'test',
      migrations: [`${__dirname}/migrations/*{.ts,.js}`],
      timezone: 'Z',
    }),
    ThrottlerModule.forRoot({
      ttl: 10,
      limit: 10,
    }),
    BullModule.forRoot({
      redis: {
        host: get('redis.host'),
        port: +get('redis.port'),
        password: get('redis.password'),
      },
    }),
    AuthorizationModule,
    UserModule,
    ContactModule,
    NotificationModule,
    QueueModule,
    MessageModule,
    TriggerTimeSlotModule,
    FileModule,
  ],
  providers: [RedisProvider],
})
export class AppModule {}
