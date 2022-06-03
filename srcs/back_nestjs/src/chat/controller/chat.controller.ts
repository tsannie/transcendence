import { Controller, Get, Header, Post } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ChatGateway } from '../chat.gateway';
import { ChatService } from '../service/chat.service';

@Controller('chat')
export class ChatController {

	constructor( private chatGateway: ChatGateway ) {}

		@Get()
    @Header('Access-Control-Allow-Origin', '*')
    handleEvent() : string {
      return this.chatGateway.handleEvent('msgdata');
    }
}