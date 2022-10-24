import { Type } from 'class-transformer';
import { IsDefined, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class LoadMessagesDto {
  @IsDefined()
  @IsNotEmpty()
  @Type(() => String)
  id: string;

  @IsDefined()
  @IsNotEmpty()
  @Type(() => Number)
  @Min(0)
  offset: number;
}
