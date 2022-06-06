import { Body, Controller, Delete, Get, Header, Post } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from '../service/user.service';
import { IUser } from '../models/user.interface';
import { UserDto } from '../dto/user.dto';

@Controller('user')
export class UserController {

  constructor( private userService: UserService ) {}

  @Post()
  @Header('Access-Control-Allow-Origin', '*')
  async add(@Body() user: UserDto): Promise<UserDto> {
    return await this.userService.add(user);
  }

  @Get()
  @Header('Access-Control-Allow-Origin', '*')
  getAllUser(): Observable<UserDto[]> {
    return this.userService.getAllUser();
  }

  @Delete()
  cleanAllUser(): Observable<void> {
    return this.userService.cleanAllUser();
  }
}
