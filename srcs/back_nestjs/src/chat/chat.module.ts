import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './service/chat.service';

@Module({
  providers: [ChatService, ChatGateway]
})

export class ChatModule {}