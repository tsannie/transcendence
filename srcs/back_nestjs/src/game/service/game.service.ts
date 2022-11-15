import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/models/user.entity';
import { UserService } from 'src/user/service/user.service';
import { Repository } from 'typeorm';
import { GameStatEntity } from '../entity/gameStat.entity';
import { RoomStatus } from '../const/const';
import { PlayerEntity } from '../entity/players.entity';
import { RoomEntity } from '../entity/room.entity';
import { SetEntity } from '../entity/set.entity';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(RoomEntity)
    private all_game: Repository<RoomEntity>,

    @InjectRepository(GameStatEntity)
    private gameStatRepository: Repository<GameStatEntity>,

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

  async getStat(room_game: RoomEntity) {
    //console.log("room game = ", room_game);
    let statGame = new GameStatEntity();
    let eloDiff: number;

    const p1: UserEntity = await this.userService.findByName(room_game.set.p1.name);
    const p2: UserEntity = await this.userService.findByName(room_game.set.p2.name);
    console.log("room_name end game = ", room_game);

    statGame.players = [p1, p2];
    statGame.p1_score = room_game.set.p1.score;
    statGame.p2_score = room_game.set.p2.score;

    if (room_game.set.p1.won) {
      eloDiff = this.calculateElo(p1.elo, p2.elo, true);

      p1.elo += eloDiff;
      p2.elo -= eloDiff;
      p1.wins++;
      statGame.winner_id = p1.id;
    }
    else {
      eloDiff = this.calculateElo(p1.elo, p2.elo, false);
      p1.elo -= eloDiff;
      p2.elo += eloDiff;
      p2.wins++;
      statGame.winner_id = p2.id;
    }
    p1.matches++;
    p2.matches++;
    statGame.eloDiff = eloDiff;
    if (!p1.history)
      p1.history = [];
    if (!p2.history)
      p2.history = [];
    p1.history.push(statGame);
    p2.history.push(statGame);

    await this.userService.add(p1);
    await this.userService.add(p2);
    // save game stat in db
    await this.gameStatRepository.save(statGame);
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
