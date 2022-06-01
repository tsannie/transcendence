import { IsDefined, IsEmail, IsNotEmpty } from "class-validator";

export class UserDto {

  id: number;

  @IsDefined()
  @IsNotEmpty()
  name: string;

  @IsDefined()
  @IsEmail()
  email: string;

  @IsDefined()
  @IsNotEmpty()
  password: string;

  createdAt: Date;
  updatedAt: Date;
}
