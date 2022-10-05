import { Body, Controller, Get, Post, Query, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import JwtTwoFactorGuard from 'src/auth/guard/jwtTwoFactor.guard';
import { DmIdDto, DmNameDto } from '../dto/dm.dto';
import { DmEntity } from '../models/dm.entity';
import { DmService } from '../service/dm.service';

@Controller('dm')
export class DmController {
	constructor(
		private readonly dmService: DmService
	) {}

	// get all conversations of a user
	@UseGuards( JwtTwoFactorGuard )
	@Get('list')
	async getDmsList(@Request() req): Promise<DmEntity[]> {
		return await this.dmService.getDmsList(req.user);
	}

	@UseGuards( JwtTwoFactorGuard )
	@Post('createDm')
	async createDm(@Body() data: DmNameDto, @Request() req): Promise<void | DmEntity> {
		return await this.dmService.createDm(data, req.user);
	}


	// get a dm by id
	@UseGuards( JwtTwoFactorGuard )
	@Get('getDmById')
	async getDmById(@Query() data: DmIdDto): Promise<DmEntity> {
		return await this.dmService.getDmById(data.id, data.offset);
	}

	@UseGuards( JwtTwoFactorGuard )
	@Get('getDmByName')
	async getDmByName( @Query() data: DmNameDto, @Request() req): Promise<DmEntity> {
		return await this.dmService.getDmByName(data, req.user);
	}
}