import { Module } from '@nestjs/common';
import { GameService } from './service/game.service';
import { GameController } from './controller/game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameGateway } from './game.gateway';
import { RoomEntity } from './entity/room.entity';
import { PlayerEntity } from './entity/players.entity';
import { UserModule } from 'src/user/user.module';
import { GameStatEntity } from './entity/gameStat.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoomEntity, PlayerEntity, GameStatEntity]),
    UserModule,
    AuthModule,
  ],
  controllers: [GameController],
  providers: [GameService, GameGateway],
})
export class GameModule {}
