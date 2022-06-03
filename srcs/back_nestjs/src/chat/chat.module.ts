import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './controller/chat.controller';
import { ChatService } from './service/chat.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService, ChatGateway]
})

export class ChatModule {}