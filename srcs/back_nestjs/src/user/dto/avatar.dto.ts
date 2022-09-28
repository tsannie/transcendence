import { IsDefined, IsString } from "class-validator";

export class AvatarDto {
    @IsDefined()
    @IsString()
    image: string;
}