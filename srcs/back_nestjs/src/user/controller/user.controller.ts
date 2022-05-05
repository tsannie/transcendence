import { Body, Controller, Get, Header, Post } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from '../service/user.service';
import { IUser } from '../models/user.interface';

@Controller('user')
export class UserController {

	constructor( private userService: UserService ) {}

		@Post()
		add(@Body() user: IUser): Observable<IUser> {
			return this.userService.add(user);
		}

		@Get()
		@Header('Access-Control-Allow-Origin', '*')
		getAllUser(): Observable<IUser[]> {
			return this.userService.getAllUser();
		}
}
