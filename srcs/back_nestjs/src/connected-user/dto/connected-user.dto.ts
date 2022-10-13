import { Type } from "class-transformer";
import { IsDefined, IsNotEmpty, IsOptional, Min } from "class-validator";
import { UserEntity } from "src/user/models/user.entity";

export class ConnectedUserDto{

    @IsDefined()
    @IsNotEmpty()
    @Type( () => Number )
    @Min(0)
    id: number;

    @IsDefined()
    @IsNotEmpty()
    @Type( () => String )
    @Min(0)
    socketId: string;

    @IsDefined()
    @IsNotEmpty()
    @Type( () => UserEntity )
    user: UserEntity;

}