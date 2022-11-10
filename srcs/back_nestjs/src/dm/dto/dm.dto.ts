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
  targetId: string;
}

export class DmIdDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  id: string;
}
