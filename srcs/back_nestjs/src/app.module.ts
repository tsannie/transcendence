import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
//import { AuthResolver } from './auth/auth.resolver';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/service/auth.service';
import { UserService } from './user/service/user.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserEntity } from './user/models/user.entity';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './auth/local.strategy';

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
    TypeOrmModule.forFeature([UserEntity]),
    UserModule,
    AuthModule,
    PassportModule
  ],
  controllers: [AppController],
  providers: [AppService, JwtService, AuthService, UserService, LocalStrategy], // AuthResolver
})
export class AppModule {}
