import { Type } from 'class-transformer';
import { IsDefined, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class LoadMessagesDto {
  @IsDefined()
  @IsNotEmpty()
  @Type(() => String)
  id: string;
}
