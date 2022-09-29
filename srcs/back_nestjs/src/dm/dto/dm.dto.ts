import { IsDefined, IsNotEmpty, IsString } from "class-validator";

export class DmDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  target: string;
}