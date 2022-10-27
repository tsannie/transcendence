import { Type } from 'class-transformer';
import { IsDefined, IsNotEmpty, IsOptional, Min } from 'class-validator';
import { UserEntity } from 'src/user/models/user.entity';

export class MessageDto {
  @IsDefined()
  @IsNotEmpty()
  @Type(() => String)
  convId: string; // id du dm ou du channel

  @IsDefined()
  @IsNotEmpty()
  @Type(() => UserEntity)
  author: UserEntity;

  @IsDefined()
  @IsNotEmpty()
  @Type(() => String)
  content: string;

  @IsDefined()
  @IsNotEmpty()
  @Type(() => Boolean)
  isDm: boolean;
}
