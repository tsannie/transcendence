import { IsDefined, IsNotEmpty, IsNumberString } from 'class-validator';

export class TokenDto {
  @IsNumberString()
  @IsDefined()
  @IsNotEmpty()
  token: string;
}
