import { Type } from 'class-transformer';
import { IsDefined, IsNotEmpty } from 'class-validator';

export class PaddleDto {
  @IsDefined()
  @IsNotEmpty()
  @Type(() => String)
  room: string; // id du dm ou du channel

  @IsDefined()
  @IsNotEmpty()
  @Type(() => Number)
  paddle_y: number;

  @IsDefined()
  @IsNotEmpty()
  @Type(() => Boolean)
  im_p2: boolean;

  @IsDefined()
  @IsNotEmpty()
  @Type(() => Number)
  front_canvas_height: number;
}
