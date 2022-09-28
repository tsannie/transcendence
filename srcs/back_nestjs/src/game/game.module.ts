import { Module } from '@nestjs/common';
import { GameService } from './game_service/game.service';
import { GameController } from './game_controller/game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResumeEntity } from './game_entity/resume.entity';
import { GameGateway } from './game.gateway';
import { SetEntity } from './game_entity/set.entity';
import { GameEntity } from './game_entity/game.entity';
import { BallEntity } from './game_entity/ball.entity';
import { PaddleEntity } from './game_entity/paddle.entity';
import { PlayerEntity } from './game_entity/players.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GameEntity,
      ResumeEntity,
      SetEntity,
      PlayerEntity,
      PaddleEntity,
      BallEntity,
    ]),
  ],
  controllers: [GameController],
  providers: [GameService, GameGateway],
})
export class GameModule {}
