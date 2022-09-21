import { Controller, Get } from '@nestjs/common';
import { GameEntity } from '../game_entity/game.entity';
import { GameService } from '../game_service/game.service';

@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @Get()
  index(): Promise<GameEntity[]> {
    return this.gameService.findAll();
  }

  @Get('/del')
  detail() {
    for (let x = 0; x < 1000; x++)
      this.gameService.deleteUser(x);
  }
}
