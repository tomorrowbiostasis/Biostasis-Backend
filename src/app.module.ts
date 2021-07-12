import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorizationModule } from './authentication/authenticaiton.module';
import { UserModule } from './user/user.module';
import { ContactModule } from './contact/contact.module';
import { get } from 'config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...get('database'),
      entities: [`${__dirname}/**/*.entity{.ts,.js}`],
      migrationsRun: process.env.NODE_ENV === 'test',
      migrations: [`${__dirname}/migrations/*{.ts,.js}`],
    }),
    AuthorizationModule,
    UserModule,
    ContactModule,
  ],
})
export class AppModule {}
