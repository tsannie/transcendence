import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DmEntity } from '../models/dm.entity';

@Controller('dm')
export class DmController {
  /* @UseGuards( AuthGuard('jwt') )
  @Post('createDm')
  async createDm(@Body() channel: CreateDmDto, @Request() req): Promise<void | DmEntity> {
    return await this.dmService.createDm(channel, req.user);
  } */
}
