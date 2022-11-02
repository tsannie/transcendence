import { Controller, Get, Param, Query } from '@nestjs/common';
import { RoomEntity } from '../game_entity/room.entity';
import { GameService } from '../game_service/game.service';

@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @Get()
  index(): Promise<RoomEntity[]> {
    return this.gameService.findAll();
  }

  @Get('/game_to_spec')
  spec(): Promise<RoomEntity[]> {
    return this.gameService.findAll();
  }

  @Get('/ball')
  ball(@Query() room_name: any) {
    console.log("qweqwe", room_name);
    return this.gameService.get_ball(room_name.room);
  }

  @Get('/del')
  detail() {
    for (let x = 0; x < 3000; x++)
      this.gameService.deleteUser(x);
  }

  @Get('/dell/:room_name')
  detail2(room_name: string) {
    this.gameService.delete_room_name(room_name);
  }
}
