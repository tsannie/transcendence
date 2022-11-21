import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectedUserEntity } from './models/connected-user.entity';
import { ConnectedUserService } from './service/connected-user.service';

@Module({
  imports: [TypeOrmModule.forFeature([ConnectedUserEntity])],
  providers: [ConnectedUserService],
  exports: [ConnectedUserService],
})
export class ConnectedUserModule {}