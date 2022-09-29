import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DmEntity } from 'src/dm/models/dm.entity';
import { MessageEntity } from 'src/message/models/message.entity';
import { UserEntity } from 'src/user/models/user.entity';
import { UserModule } from 'src/user/user.module';
import { ChannelController } from './controller/channel.controller';
import { ChannelEntity } from './models/channel.entity';
import { ChannelService } from './service/channel.service';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([DmEntity, ChannelEntity, UserEntity, MessageEntity]),
  ],
  controllers: [ChannelController],
  providers: [ChannelService],
  exports: [ChannelService]
})
export class ChannelModule {}
