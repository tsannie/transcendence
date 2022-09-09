import { Contains, Equals, IsAlphanumeric, IsDefined, IsIn, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min, MinLength } from "class-validator";
import { CreateDateColumn } from "typeorm";

const statuses = [ "Public", "Private", "Protected" ]

export class ChannelDto {

  @IsDefined()
  @IsNotEmpty()
  @IsString()
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
  @MaxLength(10)
  password: string;
}
