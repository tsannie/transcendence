import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomEntity } from '../models/room.entity';
import { IRoom } from '../models/room.interface';

@Injectable()
export class RoomService {
  /* constructor(
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>
  ) { } */
  /* getRoomById(roomid: number): RoomEntity {
    return this.roomRepository.findByIds(roomid);
  } */
}
