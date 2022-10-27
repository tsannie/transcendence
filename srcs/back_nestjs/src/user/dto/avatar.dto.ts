import { IsDefined, IsString } from "class-validator";

export class AddAvatarDto {
    @IsDefined()
    @IsString()
    image: string;
}