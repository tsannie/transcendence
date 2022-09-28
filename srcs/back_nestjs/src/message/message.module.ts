import { Module } from '@nestjs/common';
import { MessageGateway } from './message.gateway';
import { MessageController } from './controller/message.controller';
import { MessageService } from './service/message.service';
import { MessageEntity } from './models/message.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/models/user.entity';
import { UserModule } from 'src/user/user.module';
import { ChannelModule } from 'src/channel/channel.module';
import { ChannelService } from 'src/channel/service/channel.service';
import { ChannelEntity } from 'src/channel/models/channel.entity';
import { DmEntity } from 'src/dm/models/dm.entity';
import { DmModule } from 'src/dm/dm.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MessageEntity, DmEntity, UserEntity]),
    UserModule,
    ChannelModule,
    DmModule
  ],
  controllers: [MessageController],
  providers: [MessageService, MessageGateway],
})
export class MessageModule {}
