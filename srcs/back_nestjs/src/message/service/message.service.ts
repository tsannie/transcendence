import { Get, Injectable, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { UserEntity } from 'src/user/models/user.entity';
import { UserService } from 'src/user/service/user.service';
import { Repository } from 'typeorm';
import { MessageEntity } from '../models/message.entity';
import { IMessage } from '../models/message.interface';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private allMessages: Repository<MessageEntity>,
    private allUsers: UserService,
  ) {}

  // getAllMessages(): Observable<IMessage[]> {
  //   return from(this.allMessages.find());
  // }

  // add(message: IMessage): Observable<IMessage> {
  //   return from(this.allMessages.save(message));
  // }
}
