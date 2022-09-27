import { Body, Controller, Post } from '@nestjs/common';
import { MessageService } from '../service/message.service';

@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService,
    ) {}


	//DELETE THIS TEST ROUTE
	@Post("addChannel")
	async addMessageChannel(@Body() data) {
		return await this.messageService.addMessagetoChannel(data);
	}

	@Post("addDm")
	async addDm(@Body() data) {
		return await this.messageService.addMessagetoDm(data);
	}
}
