import {
  Controller,
  Get,
  Param,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import JwtTwoFactorGuard from 'src/auth/guard/jwtTwoFactor.guard';
import { RoomEntity } from '../entity/room.entity';
import { GameService } from '../service/game.service';

@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  /*@Get()
  async index(): Promise<RoomEntity[]> {
    return await this.gameService.findAll();
  }*/

  /*@Get('/del')
  async detail() {
    await this.gameService.deleteUser();
  }*/
}
