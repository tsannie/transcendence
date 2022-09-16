import { IsDefined, IsNotEmpty, IsString } from "class-validator";

export class BanMuteDto {
	@IsDefined()
	@IsNotEmpty()
	@IsString()
	channel_name: string;

	@IsDefined()
	@IsNotEmpty()
	@IsString()
	target: string;
}