import { Type } from 'class-transformer';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';
import { GameMode } from '../class/room.class';

export class CreateRoomDto {
  @IsDefined()
  @IsNotEmpty()
  mode: GameMode;

  @IsString()
  invitation_user_id?: string;
}
