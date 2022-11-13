import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { AVATAR_SIZES } from '../service/user.service';

export class TargetNameDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  username: string;
}

export class TargetIdDto {
  @IsDefined()
  @IsNotEmpty()
  @Type(() => Number)
  id: number;
}

export class AvatarDto extends TargetIdDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  /* This checks, in the array loaded from user.service, that the key requested through the DTO is
    in the list of available sizes
    avatar sizes are [
        "medium",
        "small",
    ]*/
  @IsIn(Array.from(AVATAR_SIZES.keys()))
  size: string = 'medium';
}
