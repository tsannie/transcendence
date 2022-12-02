import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export default class FortyTwoGuard extends AuthGuard('42') {}
