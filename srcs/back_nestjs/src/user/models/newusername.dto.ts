import { IsAlphanumeric, IsDefined, IsNotEmpty, Length } from "class-validator";

export class NewUsernameDto {

  @IsNotEmpty()
  @IsDefined()
  @IsAlphanumeric()
  @Length(5, 20)
  username: string;
}
