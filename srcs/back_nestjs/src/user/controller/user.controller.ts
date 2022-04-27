import { Body, Controller, Get, Post } from '@nestjs/common';
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
		getAllUser(): Observable<IUser[]> {
			return this.userService.getAllUser();
		}
}
