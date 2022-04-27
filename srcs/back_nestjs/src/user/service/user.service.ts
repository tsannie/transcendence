import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { UserEntity } from '../models/user.entity';
import { IUser } from '../models/user.interface';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserEntity)
		private allUser: Repository<UserEntity>
	) {}

	add(user: IUser): Observable<IUser> {
		return from(this.allUser.save(user));
	}

	getAllUser(): Observable<IUser[]> {
		return from(this.allUser.find());
	}
}
