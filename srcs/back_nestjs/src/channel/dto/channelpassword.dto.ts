import { IsAlphanumeric, IsDefined, IsNotEmpty, IsOptional, IsString, MaxLength,  MinLength } from "class-validator";

export class ChannelPasswordDto {

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    @MinLength(1)
    @MaxLength(50)
    name: string;
  
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    @IsAlphanumeric()
    @MinLength(1)
    @MaxLength(50)
    current_password: string;

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    @IsAlphanumeric()
    @MinLength(1)
    @MaxLength(50)
    new_password: string;
  }