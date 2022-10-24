import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/service/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/models/user.entity';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy/jwt.strategy';
import { FortyTwoStrategy } from './strategy/fortyTwo.strategy';
import { JwtTwoFactorStrategy } from './strategy/jwtTwoFactor.strategy';
import { HttpModule } from '@nestjs/axios';
import { GoogleStrategy } from './strategy/google.strategy';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([UserEntity]),
    UserModule,
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtService,
    UserService,
    JwtStrategy,
    FortyTwoStrategy,
    GoogleStrategy,
    JwtTwoFactorStrategy
  ],
  exports: [AuthService],
})
export class AuthModule {}
