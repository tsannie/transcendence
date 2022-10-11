import { Body, Controller, Get, Post, Query, Request, UseGuards } from '@nestjs/common';
import JwtTwoFactorGuard from 'src/auth/guard/jwtTwoFactor.guard';
import { LoadMessagesDto } from '../dto/loadmessages.dto';
import { MessageService } from '../service/message.service';

@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService,
    ) {}


	//TODO DELETE THIS ROUTE LATER, USED FOR DEBUGGING
	@Post("addToChannel")
	async addMessageChannel(@Body() data) {
		return await this.messageService.addMessagetoChannel(data);
	}

	//TODO DELETE THIS ROUTE LATER, USED FOR DEBUGGING
	@Post("addToDm")
	async addDm(@Body() data) {
		return await this.messageService.addMessagetoDm(data);
	}

	@UseGuards( JwtTwoFactorGuard )
	@Get("dm")
	async loadDmMessages(@Query() data: LoadMessagesDto, @Request() req) {
		return await this.messageService.loadMessages("dm", data.id, data.offset, req.user);
	}

	@UseGuards( JwtTwoFactorGuard )
	@Get("channel")
	async loadChannelMessages(@Query() data: LoadMessagesDto, @Request() req) {
		return await this.messageService.loadMessages("channel", data.id, data.offset, req.User);
	}
}
