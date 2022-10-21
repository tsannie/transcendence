import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectedUserEntity } from './connected-user.entity';
import { ConnectedUserController } from './controller/connected-user.controller';
import { ConnectedUserService } from './service/connected-user.service';

@Module({
  imports: [TypeOrmModule.forFeature([ConnectedUserEntity])],
  controllers: [ConnectedUserController],
  providers: [ConnectedUserService],
  exports: [ConnectedUserService],
})
export class ConnectedUserModule {}
