import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Socket } from 'socket.io';
import { Repository } from 'typeorm';
import {
  canvas_back_height,
  canvas_back_width,
  rad,
  gravity,
} from '../const/const';
import { BallEntity } from '../game_entity/ball.entity';
import { PlayerEntity } from '../game_entity/players.entity';
import { RoomEntity, RoomStatus } from '../game_entity/room.entity';
import { SetEntity } from '../game_entity/set.entity';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(RoomEntity)
    private all_game: Repository<RoomEntity>,
  ) {}

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
    let room_game : RoomEntity;
    const size = await this.all_game.count();
    console.log("SIZE = ", size);
    if (size != 0) {
      const all_rooms = await this.all_game.find();
      all_rooms.forEach((room_db) => {
        if (
          room_db.fast_play === true &&
          room_db.status === RoomStatus.WAITING &&
          !room_db.set  
        ) {
          room_game = room_db;
        }
      });
    }
    if (!room_game) {
      console.log("CREATE NEW GAME");
      room_game = new RoomEntity();
      room_game.fast_play = true;
      room_game.room_name = randomUUID();
    }
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

  async get_ball(room_name: string): Promise<BallEntity> {
    console.log('ROOM NAME = ', room_name);
    const room = await this.findByName(room_name);
    return room.set.ball;
  }
  //
  async deleteUser(id: number): Promise<void> {
    await this.all_game.delete(id);
  }

  async delete_room_name(room_name: string): Promise<void> {
    await this.all_game.delete({ room_name });
  }

  async InitSet(room: string, is_playing: any, game_mode: string) {
    const room_game = await this.all_game.findOneBy({ room_name: room });
    if (!room_game.set) room_game.set = new SetEntity();
    if (!room_game.set.ball) {
      room_game.set.ball = new BallEntity();
      room_game.set.ball.x = canvas_back_width / 2;
      room_game.set.ball.y = canvas_back_height / 2;
      room_game.set.ball.gravity = gravity;
      room_game.set.ball.direction_x = 1;
      room_game.set.ball.direction_y = 1;
      room_game.set.ball.rad = rad;
    }
    if (!room_game.set.p1) {
      room_game.set.p1 = new PlayerEntity();
      room_game.set.p1.name = room_game.p1.username;
    }
    if (!room_game.set.p2) {
      room_game.set.p2 = new PlayerEntity();
      room_game.set.p2.name = room_game.p2.username;
    }
    room_game.game_mode = game_mode;
    is_playing[room] = true;
    await this.all_game.save(room_game);
  }
}
