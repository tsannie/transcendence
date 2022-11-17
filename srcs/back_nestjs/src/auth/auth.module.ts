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
import { ChannelService } from 'src/channel/service/channel.service';
import { ChannelModule } from 'src/channel/channel.module';
import { DmModule } from 'src/dm/dm.module';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([UserEntity]),
    UserModule,
    PassportModule,
    ChannelModule,
    DmModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtService,
    JwtStrategy,
    FortyTwoStrategy,
    GoogleStrategy,
    JwtTwoFactorStrategy
  ],
  exports: [AuthService, JwtService],
})
export class AuthModule {}
