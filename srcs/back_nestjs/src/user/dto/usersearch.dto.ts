import { IsDefined, IsString } from 'class-validator';

export class UserSearchDto {
  @IsDefined()
  @IsString()
  search: string;
}
