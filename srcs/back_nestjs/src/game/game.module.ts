import { Module } from '@nestjs/common';
import { GameService } from './service/game.service';
import { GameController } from './controller/game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameGateway } from './game.gateway';
import { UserModule } from 'src/user/user.module';
import { GameStatEntity } from './entity/gameStat.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([GameStatEntity]), UserModule, AuthModule],
  controllers: [GameController],
  providers: [GameService, GameGateway],
})
export class GameModule {}
