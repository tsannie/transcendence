import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Server } from 'socket.io';
import { UserEntity } from 'src/user/models/user.entity';
import { UserService } from 'src/user/service/user.service';
import { Repository } from 'typeorm';
import {
  canvas_back_height,
  canvas_back_width,
  gravity,
  paddle_height,
  paddle_p1_x,
  paddle_p2_x,
  paddle_width,
  rad,
  RoomStatus,
  spawn_speed,
  speed,
  victory_score,
} from '../const/const';
import { IBall, PaddlePos } from '../const/interface';
import { PlayerEntity } from '../entity/players.entity';
import { RoomEntity } from '../entity/room.entity';
import { SetEntity } from '../entity/set.entity';
import { GameStatEntity } from '../entity/gameStat.entity';
import Room from '../class/room.class';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class GameService {
  constructor(
    // @InjectRepository(RoomEntity)
    //private all_game: Repository<RoomEntity>,

    @InjectRepository(GameStatEntity)
    private gameStatRepository: Repository<GameStatEntity>,

    @InjectRepository(PlayerEntity)
    private all_player: Repository<PlayerEntity>,

    private readonly userService: UserService,
  ) {}

  /*   async findAll(): Promise<RoomEntity[]> {
    return await this.all_game.find();
  } */

  async joinFastRoom(user: UserEntity, game: Map<string, Room>): Promise<Room> {
    console.log('joinFastRoom');
    let room_game: Room;
    let already_in_game: boolean = false;

    console.log('game.size : ', game.size);
    const size = game.size;
    if (size !== 0) {
      console.log('Join room');
      const all_rooms = game.values();
      for (const room_db of all_rooms) {
        if (
          (room_db.p1_id && user.id === room_db.p1_id) ||
          (room_db.p2_id && user.id === room_db.p2_id)
        )
          already_in_game = true;
        else if (room_db.status === RoomStatus.WAITING && !room_db.p2_id)
          room_game = room_db;
      }
    }
    if (!room_game && already_in_game === false) {
      console.log('Create room');
      room_game = new Room();
      room_game.id = uuidv4();
    }
    return room_game;
  }

  /*   async deleteUser(): Promise<void> {
    const all_game = await this.all_game.find();
    all_game.forEach(async (game) => {
      await this.all_game.delete({ id: game.id });
    });
  } */

  async giveUp(
    room: string,
    //is_playing: Map<string, boolean>,
    room_game: Room,
    user: UserEntity,
  ) {
    // if (is_playing[room])
    //  is_playing[room] = false;
    if (room_game.status === RoomStatus.PLAYING)
      room_game.status = RoomStatus.CLOSED;
    if (room_game.p1_id === user.id) {
      // why remove ?
      room_game.p1_id = null;
      room_game.p1_SocketId = null;
      room_game.won = 1;
    } else if (room_game.p2_id === user.id) {
      room_game.p2_id = null;
      room_game.p2_SocketId = null;
      room_game.won = 2;
    }
    console.log('avant le save giveup');
    //await this.all_game.save(room_game);
  }

  /*   async findRoomBySocketId(socketId: string) {
    return (
      (await this.all_game
        .createQueryBuilder('room')
        .where('room.p1SocketId = :p1SocketId', { p1SocketId: socketId })
        .getOne()) ||
      (await this.all_game
        .createQueryBuilder('room')
        .where('room.p2SocketId = :p2SocketId', { p2SocketId: socketId })
        .getOne())
    );
  } */

  ////////////////////
  // INGAME FUNCTIONS
  ////////////////////

  async losePoint(
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
    if (player.score === victory_score) player.won = true;
    await this.all_player.save(player);
    server.in(room).emit('get_players', p1, p2);
  }

  async getStat(room_game: RoomEntity) {
    console.log('CRASH 1');
    console.log(room_game);
    const p1: UserEntity = await this.userService.findById(room_game.set.p1.id);
    console.log('p1 : ', p1);
    console.log('CRASH 2');
    const p2: UserEntity = await this.userService.findById(room_game.set.p2.id);
    console.log('p2 : ', p2);
    console.log('CRASH 3');
    let statGame: GameStatEntity = this.getGameStat(p1, p2, room_game.set);
    console.log('statGame : ', statGame);
    console.log('CRASH 4');

    await this.updateHistory(p1, p2, statGame);
    console.log('CRASH 5');
    await this.gameStatRepository.save(statGame);
    console.log('CRASH 6');
  }

  getGameStat(p1: UserEntity, p2: UserEntity, set: SetEntity): GameStatEntity {
    let statGame = new GameStatEntity();

    statGame.players = [p1, p2];
    statGame.p1_score = set.p1.score;
    statGame.p2_score = set.p2.score;
    if (set.p1.won) statGame.winner_id = p1.id;
    else statGame.winner_id = p2.id;
    statGame.eloDiff = this.getElo(set, p1, p2);
    return statGame;
  }

  async updateHistory(
    p1: UserEntity,
    p2: UserEntity,
    statGame: GameStatEntity,
  ) {
    if (!p1.history) p1.history = [];
    if (!p2.history) p2.history = [];
    p1.history.push(statGame);
    p2.history.push(statGame);

    await this.userService.add(p1);
    await this.userService.add(p2);
  }

  getElo(set: SetEntity, p1: UserEntity, p2: UserEntity): number {
    let eloDiff: number = 0;
    if (set.p1.won) {
      eloDiff = this.calculateElo(p1.elo, p2.elo, true);

      p1.elo += eloDiff;
      p2.elo -= eloDiff;
      p1.wins++;
    } else {
      eloDiff = this.calculateElo(p1.elo, p2.elo, false);
      p1.elo -= eloDiff;
      p2.elo += eloDiff;
      p2.wins++;
    }
    p1.matches++;
    p2.matches++;
    return eloDiff;
  }

  probaToWinWithElo(eloP1: number, eloP2: number): number {
    return (
      (1.0 * 1.0) / (1 + 1.0 * Math.pow(10, (1.0 * (eloP1 - eloP2)) / 400))
    );
  }

  calculateElo(eloP1: number, eloP2: number, isWinnerP1: boolean): number {
    let eloDiff: number = 0;
    const p1 = this.probaToWinWithElo(eloP2, eloP1);
    const p2 = this.probaToWinWithElo(eloP1, eloP2);

    if (isWinnerP1 === true) {
      eloDiff = 30 * (1 - p1);
    } else {
      eloDiff = 30 * (1 - p2);
    }
    // round elodiff to be a number
    console.log('elo diff = ', eloDiff, ' == ', Math.round(eloDiff));
    return Math.round(eloDiff);
  }
  hitPaddle(y: number, ball: IBall) {
    let res = y + paddle_height - ball.y;
    ball.gravity = -(res / 10 - paddle_height / 20);
    Math.abs(ball.gravity);

    ball.direction_x *= -1;

    if (ball.y < y - paddle_height / 2) ball.direction_y = -1;
    else ball.direction_y = 1;
    ball.first_col = true;
    ball.can_touch_paddle = false;
  }

  async ballHitPaddlep1(
    set: SetEntity,
    ball: IBall,
    y1: number,
    server: Server,
    room: string,
  ) {
    if (
      ball.can_touch_paddle === true &&
      ball.x - rad <= paddle_p1_x + paddle_width &&
      ball.x + rad / 3 >= paddle_p1_x &&
      ball.y + rad >= y1 &&
      ball.y - rad <= y1 + paddle_height
    )
      this.hitPaddle(y1, ball);
    else if (ball.x - rad <= -(rad * 3))
      await this.losePoint(set.p2, ball, set.p1, set.p2, server, room);
  }

  async ballHitPaddlep2(
    set: SetEntity,
    ball: IBall,
    y2: number,
    server: Server,
    room: string,
  ) {
    if (
      ball.can_touch_paddle === true &&
      ball.x + rad >= paddle_p2_x &&
      ball.x - rad / 3 <= paddle_p2_x + paddle_width &&
      ball.y + rad >= y2 &&
      ball.y - rad <= y2 + paddle_height
    )
      this.hitPaddle(y2, ball);
    else if (ball.x + rad >= canvas_back_width + rad * 3)
      await this.losePoint(set.p1, ball, set.p1, set.p2, server, room);
  }

  updateBall(ball: IBall) {
    if (
      ball.x > canvas_back_width / 2 - 10 &&
      ball.x < canvas_back_width / 2 + 10 &&
      ball.can_touch_paddle == false
    ) {
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
    else if (ball.y - rad <= canvas_back_height / 40) ball.direction_y *= -1;
  }

  createBall(): IBall {
    return {
      x: canvas_back_width / 2,
      y: canvas_back_height / 2,
      gravity: gravity,
      first_col: false,
      col_paddle: false,
      can_touch_paddle: true,
      direction_x: 1,
      direction_y: 1,
    };
  }

  async updateGame(
    BallObj: IBall,
    set: SetEntity,
    Room: Room,
    server: Server,
    room: string,
  ) {
    this.updateBall(BallObj);
    await this.ballHitPaddlep1(set, BallObj, Room.p1_y_paddle, server, room);
    await this.ballHitPaddlep2(set, BallObj, Room.p2_y_paddle, server, room);
  }
}
