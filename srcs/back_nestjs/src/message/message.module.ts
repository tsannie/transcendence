import { forwardRef, Module } from '@nestjs/common';
import { MessageGateway } from './message.gateway';
import { MessageController } from './controller/message.controller';
import { MessageService } from './service/message.service';
import { MessageEntity } from './models/message.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/models/user.entity';
import { UserModule } from 'src/user/user.module';
import { DmEntity } from 'src/dm/models/dm.entity';
import { DmModule } from 'src/dm/dm.module';
import { AuthModule } from 'src/auth/auth.module';
import { ChannelModule } from 'src/channel/channel.module';
import { ConnectedUserModule } from 'src/connected-user/connected-user.module.';

@Module({
  imports: [
    TypeOrmModule.forFeature([MessageEntity, DmEntity, UserEntity]),
    UserModule,
    DmModule,
    ChannelModule,
    AuthModule,
    ConnectedUserModule,
  ],
  controllers: [MessageController],
  providers: [MessageService, MessageGateway],
  exports: [MessageService],
})
export class MessageModule {}
