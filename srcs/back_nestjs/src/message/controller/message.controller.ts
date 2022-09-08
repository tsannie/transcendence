import { Body, Controller, Get, Header, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageBody } from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { UserService } from 'src/user/service/user.service';
import { Repository } from 'typeorm';
import { MessageGateway } from '../message.gateway';
import { MessageEntity } from '../models/message.entity';
import { IMessage } from '../models/message.interface';
import { MessageService } from '../service/message.service';

@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService,
    ) {}

  // @Get('all')
  // getAllMessages(): Observable<IMessage[]> {
  //   return this.messageService.getAllMessages();
  // }

  // @Post('add')
  // add(message: IMessage): Observable<IMessage> {
  //   return this.messageService.add(message);
  // }
}
