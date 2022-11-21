import { Module } from '@nestjs/common';
import { GameService } from './service/game.service';
import { GameController } from './controller/game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameGateway } from './game.gateway';
import { SetEntity } from './entity/set.entity';
import { RoomEntity } from './entity/room.entity';
import { PlayerEntity } from './entity/players.entity';
import { UserModule } from 'src/user/user.module';
import { GameStatEntity } from './entity/gameStat.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ConnectedUserModule } from 'src/connected-user/connected-user.module.';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoomEntity, SetEntity, PlayerEntity, GameStatEntity]),
    UserModule,
    AuthModule,
    ConnectedUserModule,
  ],
  controllers: [GameController],
  providers: [GameService, GameGateway],
})
export class GameModule {}
