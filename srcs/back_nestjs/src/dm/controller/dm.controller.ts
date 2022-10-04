import { Body, Controller, Get, Post, Query, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DmDto } from '../dto/dm.dto';
import { DmEntity } from '../models/dm.entity';
import { DmService } from '../service/dm.service';

@Controller('dm')
export class DmController {
	constructor(
		private readonly dmService: DmService
	) {}
 
	// get all conversations of a user
	@UseGuards( AuthGuard('jwt') )
	@Get('list')
	async getDmsList(@Request() req): Promise<DmEntity[]> {
		return await this.dmService.getDmsList(req.user);
	}

	@UseGuards( AuthGuard('jwt') )
	@Post('createDm')
	async createDm(@Body() channel: DmDto, @Request() req): Promise<DmEntity> {
		return await this.dmService.createDm(channel, req.user);
	}


	// get a dm by id
	@UseGuards( AuthGuard('jwt') )
	@Get('getDmById')
	async getDmById(@Query() data: DmDto): Promise<DmEntity> {
		return await this.dmService.getDmById(data.id, data.offset);
	}

	@UseGuards( AuthGuard('jwt') )
	@Get('getDmByName')
	async getDmByName( @Query() data: DmDto, @Request() req): Promise<DmEntity> {
		return await this.dmService.getDmByName(data, req.user);
	}
}