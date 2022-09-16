import { IsDefined, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class ChannelDto {

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  password: string;
}