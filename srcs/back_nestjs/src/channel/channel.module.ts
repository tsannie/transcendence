import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DmEntity } from 'src/dm/models/dm.entity';
import { MessageGateway } from 'src/message/message.gateway';
import { MessageModule } from 'src/message/message.module';
import { MessageEntity } from 'src/message/models/message.entity';
import { UserEntity } from 'src/user/models/user.entity';
import { UserModule } from 'src/user/user.module';
import { ChannelController } from './controller/channel.controller';
import { BanEntity, MuteEntity } from './models/ban.entity';
import { ChannelEntity } from './models/channel.entity';
import { BanMuteService } from './service/banmute.service';
import { ChannelService } from './service/channel.service';

@Module({
  imports: [
    forwardRef( () => UserModule),
    TypeOrmModule.forFeature([DmEntity, ChannelEntity, UserEntity, MessageEntity, BanEntity, MuteEntity]),
    forwardRef( () => MessageModule),
  ],
  controllers: [ChannelController],
  providers: [ChannelService, BanMuteService],
  exports: [ChannelService, BanMuteService]
})
export class ChannelModule {}
