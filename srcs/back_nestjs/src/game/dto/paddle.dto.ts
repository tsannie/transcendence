import { Type } from 'class-transformer';
import { IsDefined, IsNotEmpty } from 'class-validator';

export class PaddleDto {
  @IsDefined()
  @IsNotEmpty()
  @Type(() => String)
  room: string;

  @IsDefined()
  @IsNotEmpty()
  @Type(() => Number)
  positionY: number;

  @IsDefined()
  @IsNotEmpty()
  @Type(() => Boolean)
  isP2: boolean;

  @IsDefined()
  @IsNotEmpty()
  @Type(() => Number)
  front_canvas_height: number;
}
