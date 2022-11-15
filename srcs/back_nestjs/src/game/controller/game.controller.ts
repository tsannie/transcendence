import { Controller, Get, Param, Query } from '@nestjs/common';
import { RoomEntity } from '../entity/room.entity';
import { GameService } from '../service/game.service';

@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @Get()
  async index(): Promise<RoomEntity[]> {
    return await this.gameService.findAll();
  }

  @Get('/game_to_spec')
  spec(): Promise<RoomEntity[]> {
    return this.gameService.findAll();
  }

  @Get('/del')
  detail() {
    this.gameService.deleteUser();
  }
}
