import { Type } from 'class-transformer';
import { IsDefined, IsNotEmpty } from 'class-validator';

export class PaddleDto {
  @IsDefined()
  @IsNotEmpty()
  @Type(() => String)
  room_id: string;

  @IsDefined()
  @IsNotEmpty()
  @Type(() => Number)
  posY: number;
}
