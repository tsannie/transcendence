import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/models/user.entity';
import { UserService } from 'src/user/service/user.service';
import { Repository } from 'typeorm';
import { GameStatEntity } from '../entity/gameStat.entity';
import { canvas_back_height, canvas_back_width, gravity, IBall, paddle_height, paddle_p1_x, paddle_p2_x, paddle_width, rad, RoomStatus, spawn_speed, speed, victory_score } from '../const/const';
import { PlayerEntity } from '../entity/players.entity';
import { RoomEntity } from '../entity/room.entity';
import { SetEntity } from '../entity/set.entity';
import { Server } from 'socket.io';
import { PaddlePos } from '../game.gateway';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(RoomEntity)
    private all_game: Repository<RoomEntity>,

    @InjectRepository(GameStatEntity)
    private gameStatRepository: Repository<GameStatEntity>,

    @InjectRepository(PlayerEntity)
    private all_player: Repository<PlayerEntity>,

    private readonly userService: UserService,
  ) {}

  findAll(): Promise<RoomEntity[]> {
    return this.all_game.find();
  }

  findByName(id: string): Promise<RoomEntity> {
    return this.all_game.findOne({
      where: {
        id: id,
      },
    });
  }

  async gameStarted(id: string): Promise<RoomEntity> {
    const game = await this.findByName(id);
    return this.all_game.save(game);
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
        else if (room_db.status === RoomStatus.WAITING && !room_db.set) {
          room_game = room_db;
        }
      });
    }
    if (!room_game && already_in_game === false) {
      console.log("CREATE NEW GAME");
      room_game = new RoomEntity();
    }
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

  async get_room(id: string): Promise<RoomEntity> {
    return await this.findByName(id);
  }

  async deleteUser(): Promise<void> {

    const all_game = await this.all_game.find();

    all_game.forEach(async (game) => {
      await this.all_game.delete({ id: game.id });
    });
  }

  async delete_room_name(room_name: string): Promise<void> {
    await this.all_game.delete({ id: room_name });
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
      room_game.p1 = null;
      room_game.set.p2.won = true;
    }
    else if (room_game.set.p2.name === user.username) {
      room_game.p2 = null;
      room_game.set.p1.won = true;
    }
    console.log("avant le save giveup")
    await this.all_game.save(room_game);
  }

  mouv_ball(ball: IBall) {
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

  colision_paddle_player(y: number, ball: IBall) {
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

  BallCol_p1(
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
      ball.y - rad <= paddle.y1 + paddle_height) {
      this.colision_paddle_player(paddle.y1, ball);
    } else if (ball.x - rad <= -(rad * 3))
      this.losePoint(set.p2, ball, set.p1, set.p2, server, room);
  }

  BallCol_p2(
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
      ball.y - rad <= paddle.y2 + paddle_height) {
      this.colision_paddle_player(paddle.y2, ball);
    } else if (ball.x + rad >= canvas_back_width + rad * 3)
      this.losePoint(set.p1, ball, set.p1, set.p2, server, room);
  }

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
    if (player.score === victory_score)
      player.won = true;
    await this.all_player.save(player);
    server.in(room).emit('get_players', p1, p2);
  }

  async getStat(room_game: RoomEntity) {
    if (room_game && (!room_game.set || !room_game.set)) { // partie annule, 1 mec a rejoint, l'autre handleDisconnect
      await this.all_game.remove(room_game);
      return ;
    }
    const p1: UserEntity = await this.userService.findByName(room_game.set.p1.name);
    const p2: UserEntity = await this.userService.findByName(room_game.set.p2.name);
    let statGame: GameStatEntity = this.getGameStat(p1, p2, room_game.set);

    await this.updateHistory(p1, p2, statGame);
    await this.gameStatRepository.save(statGame);
  }

  getGameStat(p1: UserEntity, p2: UserEntity, set: SetEntity): GameStatEntity {

    let statGame = new GameStatEntity();

    statGame.players = [p1, p2];
    statGame.p1_score = set.p1.score;
    statGame.p2_score = set.p2.score;
    if (set.p1.won)
      statGame.winner_id = p1.id;
    else
      statGame.winner_id = p2.id;
    statGame.eloDiff = this.getElo(set, p1, p2);
    return statGame;
  }

  async updateHistory(p1: UserEntity, p2: UserEntity, statGame: GameStatEntity) {
    if (!p1.history)
      p1.history = [];
    if (!p2.history)
      p2.history = [];
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
    }
    else {
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
    }
    else {
      eloDiff = 30 * (1 - p2);
    }
    // round elodiff to be a number
    console.log("elo diff = ", eloDiff, " == ", Math.round(eloDiff));
    return Math.round(eloDiff);
  }
}