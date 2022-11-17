import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './models/user.entity';
import { DmEntity } from 'src/dm/models/dm.entity';
import { ConnectedUserEntity } from 'src/connected-user/connected-user.entity';
import { HttpModule } from '@nestjs/axios';
import { ChannelModule } from 'src/channel/channel.module';
import { DmModule } from 'src/dm/dm.module';

@Module({
  imports: [
    forwardRef( () => DmModule),
    forwardRef( () => ChannelModule),
    HttpModule,
    TypeOrmModule.forFeature([DmEntity, UserEntity, ConnectedUserEntity]),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
