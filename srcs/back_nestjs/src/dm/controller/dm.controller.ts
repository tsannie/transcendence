import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateDmDto } from '../dto/dm.dto';
import { DmEntity } from '../models/dm.entity';
import { DmService } from '../service/dm.service';

@Controller('dm')
export class DmController {
  constructor(
    private readonly dmService: DmService
  ) {}

  @UseGuards( AuthGuard('jwt') )
  @Post('createDm')
  async createDm(@Body() channel: CreateDmDto, @Request() req): Promise<void | DmEntity> {
    return await this.dmService.createDm(channel, req.user);
  }

  // get all conversations of a user
  @UseGuards( AuthGuard('jwt') )
  @Get('getAllDms')
  async getAllDms(@Request() req): Promise<void | DmEntity[]> {
    return await this.dmService.getAllDms(req.user);
  }

  // get a dm by id
  @Get('getDmById')
  async getDmById(id: number): Promise<void | DmEntity> {
    return await this.dmService.getDmById(id);
  }
}
