import { Type } from 'class-transformer';
import { IsDefined, IsNotEmpty } from 'class-validator';

export class CreateRoomDto {
  @IsDefined()
  @IsNotEmpty()
  @Type(() => String)
  room: string;

  @IsDefined()
  @IsNotEmpty()
  @Type(() => String)
  mode: string;

}
