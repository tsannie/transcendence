import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelEntity } from 'src/channel/models/channel.entity';
import { MessageEntity } from 'src/message/models/message.entity';
import { UserEntity } from 'src/user/models/user.entity';
import { UserService } from 'src/user/service/user.service';
import { DmController } from './controller/dm.controller';
import { DmEntity } from './models/dm.entity';
import { DmService } from './service/dm.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([DmEntity, ChannelEntity, UserEntity, MessageEntity]),
  ],
  controllers: [DmController],
  providers: [DmService, UserService],
  exports: [DmService]
})
export class DmModule {}
