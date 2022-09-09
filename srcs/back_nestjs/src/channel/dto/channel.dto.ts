import { Contains, IsDefined, IsNotEmpty } from "class-validator";
import { CreateDateColumn } from "typeorm";

export class ChannelDto {

  @IsDefined()
  @IsNotEmpty()
  name: string;

  @IsDefined()
  @IsNotEmpty()
  status: string;

  @IsDefined()
  @IsNotEmpty()
  ownerid: string;
}
