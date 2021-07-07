import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorizationModule } from './authentication/authenticaiton.module';
import { UserModule } from './user/user.module';
import { get } from 'config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...get('database'),
      entities: [`${__dirname}/**/*.entity{.ts,.js}`],
      migrationsRun: true,
      migrations: [`${__dirname}/migrations/*{.ts,.js}`],
    }),
    AuthorizationModule,
    UserModule,
  ],
})
export class AppModule {}
