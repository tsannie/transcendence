import { Type } from 'class-transformer';
import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class DmNameDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  target: string;
}

export class DmIdDto {
  @IsDefined()
  @IsNotEmpty()
  @Type(() => String)
  @IsString()
  id: string;
}
