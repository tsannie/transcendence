import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from 'src/message/models/message.entity';
import { UserEntity } from 'src/user/models/user.entity';
import { UserService } from 'src/user/service/user.service';
import { ChannelController } from './controller/channel.controller';
import { ChannelEntity } from './models/channel.entity';
import { ChannelService } from './service/channel.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChannelEntity, UserEntity, MessageEntity]),
  ],
  controllers: [ChannelController],
  providers: [ChannelService, UserService],
  exports: [ChannelService]
})
export class ChannelModule {}
