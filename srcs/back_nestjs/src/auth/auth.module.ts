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
import { LocalStrategy } from './local.strategy';

dotenv.config()

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({secret: 'secret'}), // Why dont work ??
    UserModule,
    PassportModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService, UserService, LocalStrategy],
  exports: [AuthService]
})

export class AuthModule {}
