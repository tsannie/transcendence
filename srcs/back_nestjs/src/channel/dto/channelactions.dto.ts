import { IsDefined, IsNotEmpty, IsString } from "class-validator";

export class ChannelActionsDto {
	@IsDefined()
	@IsNotEmpty()
	@IsString()
	channel_name: string;

	@IsDefined()
	@IsNotEmpty()
	@IsString()
	target: string;
}