import { Module } from '@nestjs/common';
import { GameService } from './game_service/game.service';
import { GameController } from './game_controller/game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameGateway } from './game.gateway';
import { SetEntity } from './game_entity/set.entity';
import { RoomEntity } from './game_entity/room.entity';
import { BallEntity } from './game_entity/ball.entity';
import { PlayerEntity } from './game_entity/players.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoomEntity, SetEntity, PlayerEntity, BallEntity]),
  ],
  controllers: [GameController],
  providers: [GameService, GameGateway],
})
export class GameModule {}
