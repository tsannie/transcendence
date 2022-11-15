import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Server } from 'socket.io';
import { UserEntity } from 'src/user/models/user.entity';
import { Repository } from 'typeorm';
import { canvas_back_height, canvas_back_width, gravity, paddle_height, paddle_p1_x, paddle_p2_x, paddle_width, rad, RoomStatus, spawn_speed, speed, victory_score } from '../const/const';
import { IBall, PaddlePos } from '../const/interface';
import { PlayerEntity } from '../entity/players.entity';
import { RoomEntity } from '../entity/room.entity';
import { SetEntity } from '../entity/set.entity';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(RoomEntity)
    private all_game: Repository<RoomEntity>,
    @InjectRepository(PlayerEntity)
    private all_player: Repository<PlayerEntity>,
  ) {}

  async findAll(): Promise<RoomEntity[]> {
    return await this.all_game.find();
  }

  async joinFastRoom(user: UserEntity): Promise<RoomEntity> {
    let room_game : RoomEntity;
    let already_in_game: boolean = false;
    const size = await this.all_game.count();
    if (size != 0) {
      const all_rooms = await this.all_game.find();
      all_rooms.forEach((room_db) => {
        if ((room_db.p1 && user.id === room_db.p1.id) || (room_db.p2 && user.id === room_db.p2.id))
          already_in_game = true;
        else if (room_db.status === RoomStatus.WAITING && !room_db.set)
          room_game = room_db;
      });
    }
    if (!room_game && already_in_game === false)
      room_game = new RoomEntity();
    return room_game;
  }

  async joinInvitation(room: string): Promise<RoomEntity> {
    let room_game = await this.all_game.findOneBy({ id: room });
    if (!room_game) {
      room_game = new RoomEntity();
      room_game.id = room;
    }
    return room_game;
  }

  async deleteUser(): Promise<void> {

    const all_game = await this.all_game.find();

    all_game.forEach(async (game) => {
      await this.all_game.delete({ id: game.id });
    });
  }

  async initSet(room: string, is_playing: Map<string, boolean>, game_mode: string) {
    const room_game = await this.all_game.findOneBy({ id: room });
    if (!room_game.set)
      room_game.set = new SetEntity();
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

  async giveUp(room: string, is_playing: Map<string, boolean>, room_game: RoomEntity, user: UserEntity) {
    if (is_playing[room])
      is_playing[room] = false;

    if (room_game.status === RoomStatus.PLAYING)
      room_game.status = RoomStatus.CLOSED;
    if (room_game.set.p1.name === user.username) {
      console.log("room_game.p2", room_game.set.p2.won);
      room_game.p1 = null;
      room_game.set.p2.won = true;
      console.log("room_game.p2", room_game.set.p2.won);
    }
    else if (room_game.set.p2.name === user.username) {
      room_game.p2 = null;
      room_game.set.p1.won = true;
    }
    await this.all_game.save(room_game);
  }

  ////////////////////
  // INGAME FUNCTIONS
  ////////////////////

  
  losePoint(
    player: PlayerEntity,
    ball: IBall,
    p1: PlayerEntity,
    p2: PlayerEntity,
    server: Server,
    room: string,
  ) {
    ball.x = canvas_back_width / 2;
    ball.y = canvas_back_height / 2;
    
    ball.direction_y = 1;
    ball.first_col = false;
  
    player.score += 1;
    if (player.score === victory_score)
      player.won = true;
    this.all_player.save(player);
    server.in(room).emit('get_players', p1, p2);
  }
  
  hitPaddle(y: number, ball: IBall) {
    let res = y + paddle_height - ball.y;
    ball.gravity = -(res / 10 - paddle_height / 20);
    Math.abs(ball.gravity);
  
    ball.direction_x *= -1;
  
    if (ball.y < y - paddle_height / 2)
    ball.direction_y = -1;
    else
      ball.direction_y = 1;
      ball.first_col = true;
    ball.can_touch_paddle = false;
  }
  
  ballHitPaddlep1(
    set: SetEntity,
    ball: IBall,
    paddle: PaddlePos,
    server: Server,
    room: string,
  ) {
      if (ball.can_touch_paddle === true &&
    ball.x - rad <= paddle_p1_x + paddle_width &&
    ball.x + rad / 3 >= paddle_p1_x &&
    ball.y + rad >= paddle.y1 &&
    ball.y - rad <= paddle.y1 + paddle_height)
      this.hitPaddle(paddle.y1, ball);
    else if (ball.x - rad <= -(rad * 3))
      this.losePoint(set.p2, ball, set.p1, set.p2, server, room);
    }
    
  ballHitPaddlep2(
    set: SetEntity,
    ball: IBall,
    paddle: PaddlePos,
    server: Server,
    room: string,
    ) {
      if (ball.can_touch_paddle === true &&
    ball.x + rad >= paddle_p2_x &&
    ball.x - rad / 3 <= paddle_p2_x + paddle_width &&
    ball.y + rad >= paddle.y2 &&
    ball.y - rad <= paddle.y2 + paddle_height)
      this.hitPaddle(paddle.y2, ball);
    else if (ball.x + rad >= canvas_back_width + rad * 3)
      this.losePoint(set.p1, ball, set.p1, set.p2, server, room);
  }

  updateBall(ball: IBall) {
    if (ball.x > canvas_back_width / 2 - 10 &&
    ball.x < canvas_back_width / 2 + 10 &&
    ball.can_touch_paddle == false) {
      ball.can_touch_paddle = true;
    }
    if (ball.first_col === false) {
      ball.x += spawn_speed * ball.direction_x;
      ball.y += gravity * ball.direction_y;
    } else {
      ball.x += speed * ball.direction_x;
      ball.y += ball.gravity * ball.direction_y;
    }
    if (ball.y + rad >= canvas_back_height - canvas_back_height / 40)
      ball.direction_y *= -1;
    else if (ball.y - rad <= canvas_back_height / 40)
      ball.direction_y *= -1;
  }
  
  createBall(): IBall {
    return {
      x : canvas_back_width / 2,
      y : canvas_back_height / 2,
      gravity : gravity,
      first_col: false,
      col_paddle: false,
      can_touch_paddle: true,
      direction_x : 1,
      direction_y : 1,
    };
  }
  
  updateGame(
    BallObj: IBall,
    set: SetEntity,
    paddle_pos: PaddlePos,
    server: Server,
    room: string
  ) {
    this.updateBall(BallObj);
    this.ballHitPaddlep1(set, BallObj, paddle_pos, server, room);
    this.ballHitPaddlep2(set, BallObj, paddle_pos, server, room);
  }
}