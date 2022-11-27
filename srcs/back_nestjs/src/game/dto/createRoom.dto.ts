import { Type } from 'class-transformer';
import { IsDefined, IsNotEmpty } from 'class-validator';
import { GameMode } from '../class/room.class';

export class CreateRoomDto {
  @IsDefined()
  @IsNotEmpty()
  mode: GameMode;
}
