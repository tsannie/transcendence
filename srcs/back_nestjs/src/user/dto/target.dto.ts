import { IsDefined, IsNotEmpty, IsString } from "class-validator";

export class targetDto {
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    target: string;
}