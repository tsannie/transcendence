import { IsDefined, IsString } from 'class-validator';

export class UserSearchDto {
  // TODO remove and user TargetNameDto
  @IsDefined()
  @IsString()
  search: string;
}
