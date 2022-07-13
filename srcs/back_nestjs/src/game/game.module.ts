import { Module } from '@nestjs/common';
import { GameService } from './game_service/game.service';
import { GameController } from './game_controller/game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameEntity } from './game_entity/game.entity';
import { GameGateway } from './game.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([GameEntity])],
  controllers: [GameController],
  providers: [GameService, GameGateway],
})
export class GameModule {}
