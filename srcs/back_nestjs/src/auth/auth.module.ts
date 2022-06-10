import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/service/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/models/user.entity';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import * as dotenv from 'dotenv'; // TODO delte that ?? and module
import { LocalStrategy } from './strategy/local.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';

dotenv.config()

@Module({
  imports: [
    JwtModule.register({secret: 'secret'}), // Why dont work ??
    TypeOrmModule.forFeature([UserEntity]),
    UserModule,
    PassportModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService, UserService, LocalStrategy, JwtStrategy],
  exports: [AuthService]
})

export class AuthModule {}