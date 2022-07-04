import { Controller, Get } from '@nestjs/common';
import { GameService } from '../game_service/game.service';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get()
  getHello(): string {
    return this.gameService.getHello();
  }
}
