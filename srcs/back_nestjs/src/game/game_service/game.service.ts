import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { RoomEntity, RoomStatus } from '../game_entity/room.entity';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(RoomEntity)
    private all_game: Repository<RoomEntity>,
  )
  {}

  findAll(): Promise<RoomEntity[]> {
    return this.all_game.find();
  }

  findByName(room_name: string): Promise<RoomEntity> {
    return this.all_game.findOne({
      where: {
        room_name: room_name,
      },
    });
  }

  async gameStarted(room_name: string): Promise<RoomEntity> {
    const game = await this.findByName(room_name);

    

    return this.all_game.save(game);
  }

  async joinFastRoom(room: string): Promise<RoomEntity> {

    let room_game;
    const size = await this.all_game.count();
    if (size != 0) {
      const all_rooms = await this.all_game.find();
      all_rooms.forEach((room_db) => {
        if (room_db.fast_play === true && room_db.status === RoomStatus.WAITING) {
          room_game = room_db;
        }
      });
      //console.log("1ICCCCCIII")

    } 
    if (!room_game) {
      room_game = new RoomEntity();
      room_game.fast_play = true;
      room_game.room_name = randomUUID();

      //console.log("2ICCCCCIII")
    }
   // console.log("3ICCCCCIII")

    return room_game;
  }

  async joinInvitation(room: string): Promise<RoomEntity> {

    let room_game = await this.all_game.findOneBy({ room_name: room });
    if (!room_game) {
      room_game = new RoomEntity();
      room_game.fast_play = true;
      room_game.room_name = room;
    }
    return room_game;
  }

  async get_room(room_name: string): Promise<RoomEntity> {
    return await this.findByName(room_name);
  }

  async deleteUser(id: number): Promise<void> {
    await this.all_game.delete(id);
  }

  async delete_room_name(room_name: string): Promise<void> {
    await this.all_game.delete({ room_name });
  }
}
