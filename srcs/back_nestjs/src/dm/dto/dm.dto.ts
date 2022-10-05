import { Type } from "class-transformer";
import { IsDefined, IsDivisibleBy, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from "class-validator";

export class DmNameDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  target: string;

  @IsOptional()
  @IsNotEmpty()
  @Type( () => Number )
  @Min(0)
  @IsDivisibleBy(20)
  offset: number
}

export class DmIdDto {
  @IsDefined()
  @IsNotEmpty()
  @Type( () => Number )
  @IsNumber()
  id: number;

  @IsOptional()
  @IsNotEmpty()
  @Type( () => Number )
  @Min(0)
  @IsDivisibleBy(20)
  offset: number
}