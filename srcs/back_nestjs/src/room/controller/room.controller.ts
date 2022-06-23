import { Controller, Get } from '@nestjs/common';
import { RoomEntity } from '../models/room.entity';
import { RoomService } from '../service/room.service';

@Controller('room')
export class RoomController {
  constructor( private roomService: RoomService ) {}

  /* @Get('id')
  getRoomById(): RoomEntity {
    return (this.roomService.getRoomById());
  } */
}
