import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthResolver } from './auth/auth.resolver';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot({     // TODO create class database
      type: 'postgres',
      url: process.env.POSTGRES_FORCE,
      autoLoadEntities: true,   // TODO check that
      synchronize: true
    }),
    UserModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService, AuthResolver],
})
export class AppModule {}
