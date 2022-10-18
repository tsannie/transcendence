import { Type } from "class-transformer";
import { IsDefined, IsIn, IsNotEmpty, IsString } from "class-validator";
import { AVATAR_SIZES } from "../service/user.service";


export class TargetNameDto {
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    target: string;
}

export class TargetIdDto {
	@IsDefined()
	@IsNotEmpty()
	@Type( () => Number)
	id: number;
}

export class AvatarDto extends TargetIdDto {
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    @IsIn(Array.from(AVATAR_SIZES.keys()))
    size: string;
}