import { Type } from "class-transformer";
import { IsDefined, IsNotEmpty, IsString } from "class-validator";
import { Equal } from "typeorm";

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
    size: string;
}