import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/service/user.service';
import { Repository } from 'typeorm';
import { MessageEntity } from '../models/message.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private allMessages: Repository<MessageEntity>,

    // private allUsers: UserService,
  ) {}

}
