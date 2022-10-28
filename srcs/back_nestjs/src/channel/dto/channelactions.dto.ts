import { Type } from "class-transformer";
import { IsDefined, IsNotEmpty, IsOptional, IsString, Max, Min } from "class-validator";

export class ChannelActionsDto {
	@IsDefined()
	@IsNotEmpty()
	@IsString()
	channel_name: string;

	@IsDefined()
	@IsNotEmpty()
	@IsString()
	target: string;

	/* We set time of banishment in minutes through this param in query.
	If not set, time is set to infinity */
	@IsOptional()
	@IsNotEmpty()
	@Type( () => Number )
	@Min(1)
	duration: number;
}