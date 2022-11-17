import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Query,
  Req,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import JwtTwoFactorGuard from 'src/auth/guard/jwtTwoFactor.guard';
import { LoadMessagesDto } from '../dto/loadmessages.dto';
import { MessageEntity } from '../models/message.entity';
import { MessageService } from '../service/message.service';

@Controller('message')
@UseInterceptors(ClassSerializerInterceptor)
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Get('dm')
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  async loadDmMessages(
    @Query() data: LoadMessagesDto,
    @Req() req: Request,
  ): Promise<MessageEntity[]> {
    return await this.messageService.loadMessages(
      'dm',
      data.id,
      data.offset,
      req.user,
    );
  }

  @Get('channel')
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  async loadChannelMessages(
    @Query() data: LoadMessagesDto,
    @Req() req: Request,
  ) {
    return await this.messageService.loadMessages(
      'channel',
      data.id,
      data.offset,
      req.user,
    );
  }
}
