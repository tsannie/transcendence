import { Type } from "class-transformer";
import { IsDefined, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class DmNameDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  target: string;

  @IsOptional()
  @IsNotEmpty()
  @Type( () => Number )
  @Min(0)
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
  offset: number
}

export class ListDto {
  @IsDefined()
  @IsNotEmpty()
  @Type( () => Number )
  @Min(0)
  offset: number
}