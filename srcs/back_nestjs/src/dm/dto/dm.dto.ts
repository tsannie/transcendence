import { IsDefined, IsNotEmpty, IsString } from "class-validator";
import { MessageEntity } from "src/message/models/message.entity";
import { UserEntity } from "src/user/models/user.entity";

export class CreateDmDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  targetUsername: string;
}