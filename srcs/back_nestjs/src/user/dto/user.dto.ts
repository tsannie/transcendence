import { IsEmail, IsNotEmpty } from "class-validator";

export class UserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
