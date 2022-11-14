import { Controller, Get, Param, Query, Request, UseGuards } from '@nestjs/common';
import JwtTwoFactorGuard from 'src/auth/guard/jwtTwoFactor.guard';
import { RoomEntity } from '../entity/room.entity';
import { GameService } from '../service/game.service';

@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @Get()
  index(): Promise<RoomEntity[]> {
    return this.gameService.findAll();
  }

  @Get('/game_to_spec')
  spec(): Promise<RoomEntity[]> {
    return this.gameService.findAll();
  }

  @Get('/del')
  detail() {
    this.gameService.deleteUser();
  }

  @Get('/dell/:room_name')
  detail2(room_name: string) {
    this.gameService.delete_room_name(room_name);
  }
}
