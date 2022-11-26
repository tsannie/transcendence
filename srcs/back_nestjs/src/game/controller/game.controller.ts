import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Query,
  Request,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import JwtTwoFactorGuard from 'src/auth/guard/jwtTwoFactor.guard';
import { IInfoRoom } from '../class/room.class';
import { GameService } from '../service/game.service';

@Controller('game')
@UseInterceptors(ClassSerializerInterceptor)
export class GameController {
  constructor(private gameService: GameService) {}

  @Get('rooms')
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  async getRoom(@Request() req: Request): Promise<IInfoRoom[]> {
    return this.gameService.getCurrentRooms();
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
