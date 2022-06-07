import { Body, Controller, Get, Header, Post } from '@nestjs/common';
import { MessageBody } from '@nestjs/websockets';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { MessageGateway } from '../message.gateway';
import { IMessage } from '../models/message.interface';
import { MessageService } from '../service/message.service';

@Controller('message')
export class MessageController {

	constructor( private messageGateway: MessageGateway ) {}

  @Get('all')
  getAllMessages()
  {
    return (this.messageGateway.getAllMessages());
  }
}