import { Type } from "class-transformer";
import { IsDefined, IsNotEmpty, IsString } from "class-validator";

export class targetNameDto {
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    target: string;
}

export class targetIdDto {
	@IsDefined()
	@IsNotEmpty()
	@Type( () => Number)
	id: number;
}