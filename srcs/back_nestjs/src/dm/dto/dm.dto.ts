import {
  IsDefined,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class DmTargetDto {
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
