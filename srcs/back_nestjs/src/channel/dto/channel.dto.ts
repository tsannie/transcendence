import { Type } from "class-transformer";
import { IsDefined, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";

export class ChannelDto {

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  uuid: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  password: string;
}