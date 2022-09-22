import { IsDefined, IsNotEmpty, IsString } from "class-validator";

export class CreateDmDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  target: string;
}