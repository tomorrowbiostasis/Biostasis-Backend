import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AuthorizationModule } from './authentication/authenticaiton.module';
import { UserModule } from './user/user.module';
import { ContactModule } from './contact/contact.module';
import { ThrottlerModule } from '@nestjs/throttler';
import configuration from './config/default';
import { NotificationModule } from './notification/notification.module';
import { MessageModule } from './message/message.module';
import { BullModule } from '@nestjs/bull';
import { QueueModule } from './queue/queue.module';
import { RedisProvider } from './common/provider/redis.provider';
import { TriggerTimeSlotModule } from './trigger-time-slot/trigger-time-slot.module';
import { FileModule } from './file/file.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { ConfigModule } from '@nestjs/config';

const config = configuration();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...config.database,
      entities: [`${__dirname}/**/*.entity{.ts,.js}`],
      migrationsRun: process.env.NODE_ENV === 'test',
      migrations: [`${__dirname}/migrations/*{.ts,.js}`],
      subscribers: [`${__dirname}/**/*.entity-subscriber{.ts,.js}`],
      timezone: 'Z',
    } as TypeOrmModuleOptions),
    ThrottlerModule.forRoot({
      ttl: 10,
      limit: 10,
    }),
    BullModule.forRoot({
      redis: {
        host: config.redis.host,
        port: +config.redis.port,
        password: config.redis.password,
      },
    }),
    SchedulerModule,
    AuthorizationModule,
    UserModule,
    ContactModule,
    NotificationModule,
    QueueModule,
    MessageModule,
    TriggerTimeSlotModule,
    FileModule,
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  providers: [RedisProvider],
})
export class AppModule { }
