import { Get, Injectable, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { MessageEntity } from '../models/message.entity';
import { IMessage } from '../models/message.interface';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private allMessages: Repository<MessageEntity>, //private roomService: RoomService
  ) {}

  getAllMessages(): Observable<IMessage[]> {
    return from(this.allMessages.find());
  }

  add(message: IMessage): Observable<IMessage> {
    return from(this.allMessages.save(message));
  }
}
