import { Type } from 'class-transformer';
import { IsDefined, IsNotEmpty } from 'class-validator';
import { GameMode } from '../const/const';

export class CreateRoomDto {
  @IsDefined()
  @IsNotEmpty()
  mode: GameMode;
}
