import { Module } from '@nestjs/common';
import { GameService } from './game_service/game.service';
import { GameController } from './game_controller/game.controller';

@Module({
  controllers: [GameController],
  providers: [GameService]
})
export class GameModule {}
