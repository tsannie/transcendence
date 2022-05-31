import { Module } from '@nestjs/common';
import { ChatService } from './service/chat.service';

@Module({
  providers: [ChatService]
})
export class ChatModule {}
