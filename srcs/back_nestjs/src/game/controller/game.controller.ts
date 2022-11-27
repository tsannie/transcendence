import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Query,
  Req,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import JwtTwoFactorGuard from 'src/auth/guard/jwtTwoFactor.guard';
import { IGameStat, IInfoGame, IInfoRoom } from '../class/room.class';
import { GameGateway } from '../game.gateway';
import { GameService } from '../service/game.service';

@Controller('game')
@UseInterceptors(ClassSerializerInterceptor)
export class GameController {
  constructor(
    private gameService: GameService,
    private gameGateway: GameGateway,
  ) {}

  @Get('rooms')
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  async getRoom(@Req() req: Request): Promise<IInfoRoom[]> {
    return this.gameService.getCurrentRooms();
  }

  @Get('history')
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  async getHistory(@Req() req: Request): Promise<IGameStat[]> {
    return this.gameService.getHistory(req.user);
  }

  @Get('info')
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  getInfo(@Req() req: Request): IInfoGame {
    return this.gameGateway.getInfo();
  }

  /*@Get()
  async index(): Promise<RoomEntity[]> {
    return await this.gameService.findAll();
  }*/

  /*@Get('/del')
  async detail() {
    await this.gameService.deleteUser();
  }*/
}
