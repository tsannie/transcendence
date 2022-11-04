import { Body, Controller, Get, Post, Query, Request, UseGuards } from '@nestjs/common';
import JwtTwoFactorGuard from 'src/auth/guard/jwtTwoFactor.guard';
import { LoadMessagesDto } from '../dto/loadmessages.dto';
import { MessageService } from '../service/message.service';

@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService,
    ) {}

	@UseGuards( JwtTwoFactorGuard )
	@Get("dm")
	async loadDmMessages(@Query() data: LoadMessagesDto, @Request() req) {
		return await this.messageService.loadMessages("dm", data.id, data.offset, req.user);
	}

	@UseGuards( JwtTwoFactorGuard )
	@Get("channel")
	async loadChannelMessages(@Query() data: LoadMessagesDto, @Request() req) {
		return await this.messageService.loadMessages("channel", data.id, data.offset, req.user);
	}
}
