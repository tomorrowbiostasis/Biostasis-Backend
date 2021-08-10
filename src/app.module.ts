import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorizationModule } from './authentication/authenticaiton.module';
import { UserModule } from './user/user.module';
import { ContactModule } from './contact/contact.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { get } from 'config';
import { NotificationModule } from './notification/notification.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...get('database'),
      entities: [`${__dirname}/**/*.entity{.ts,.js}`],
      migrationsRun: process.env.NODE_ENV === 'test',
      migrations: [`${__dirname}/migrations/*{.ts,.js}`],
    }),
    ThrottlerModule.forRoot({
      ttl: 10,
      limit: 10,
    }),
    AuthorizationModule,
    UserModule,
    ContactModule,
    NotificationModule,
    MessageModule,
  ],
})
export class AppModule {}
