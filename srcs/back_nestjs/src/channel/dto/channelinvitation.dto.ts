import { IsDefined, IsNotEmpty, IsString } from "class-validator";

export class ChannelInvitationDto {
	@IsDefined()
	@IsNotEmpty()
	@IsString()
	id: string;

	@IsDefined()
	@IsNotEmpty()
	@IsString()
	targetId: string;

}