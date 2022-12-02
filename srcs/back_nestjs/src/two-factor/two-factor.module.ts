import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/service/auth.service';
import { UserService } from 'src/user/service/user.service';
import { UserModule } from 'src/user/user.module';
import { TwoFactorController } from './controller/two-factor.controller';
import { TwoFactorService } from './service/two-factor.service';

@Module({
  imports: [UserModule, AuthModule],
  controllers: [TwoFactorController],
  providers: [TwoFactorService],
  exports: [TwoFactorService],
})
export class TwoFactorModule {}
