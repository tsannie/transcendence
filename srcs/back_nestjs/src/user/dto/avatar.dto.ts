import { IsDefined, IsString } from "class-validator";

export class AvatarDto {
    @IsDefined()
    @IsString()
    user: string;

    @IsDefined()
    @IsString()
    image: string;
}