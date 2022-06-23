import { Module } from '@nestjs/common';
import { MessageGateway } from './message.gateway';
import { MessageController } from './controller/message.controller';
import { MessageService } from './service/message.service';
import { MessageEntity } from './models/message.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from 'src/room/models/room.entity';
import { RoomService } from 'src/room/service/room.service';
import { RoomModule } from 'src/room/room.module';

@Module({
  imports:
  [
    TypeOrmModule.forFeature([MessageEntity])
  ],
  controllers: [MessageController],
  providers: [MessageService, MessageGateway]
})

export class MessageModule {}