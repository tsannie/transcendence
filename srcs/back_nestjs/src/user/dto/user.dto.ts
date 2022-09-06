import { IsDefined, IsEmail, IsNotEmpty } from 'class-validator';

export class UserDto {
  id?: number;

  @IsDefined()
  @IsNotEmpty()
  username: string;

  @IsDefined()
  @IsEmail()
  email: string;

  createdAt?: Date;
  updatedAt?: Date;

  enabled2FA?: boolean
  secret2FA?: string
}

// TODO ALL dto is useless ???
// replace by basic interface and delete dto ?
