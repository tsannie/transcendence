import { IsAlphanumeric, IsDefined, IsIn, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

const statuses = [ "Public", "Private", "Protected" ]

export class CreateChannelDto {

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsAlphanumeric()
  @MinLength(1)
  @MaxLength(10)
  password: string;
}