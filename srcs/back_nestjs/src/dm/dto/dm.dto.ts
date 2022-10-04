import { Type } from "class-transformer";
import { IsDefined, IsDivisibleBy, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from "class-validator";

export class DmDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  target: string;

  @IsOptional()
  @IsNotEmpty()
  @Type( () => Number )
  @IsNumber()
  id: number;

  @IsDefined()
  @IsNotEmpty()
  @Type( () => Number )
  @IsNumber()
  @Min(0)
  @IsDivisibleBy(20)
  offset: number
}