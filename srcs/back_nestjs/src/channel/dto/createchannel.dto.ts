import { IsAlphanumeric, IsDefined, IsIn, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

const statuses = [ "Public", "Private", "Protected" ]

export class CreateChannelDto {

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  name: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @IsIn(statuses)
  status: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsAlphanumeric()
  @MinLength(1)
  @MaxLength(50)
  password: string;
}
