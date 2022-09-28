import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameEntity } from '../game_entity/game.entity';
import { ResumeEntity } from '../game_entity/resume.entity';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(GameEntity)
    private all_game: Repository<GameEntity>,
  ) /*     @InjectRepository(ResumeEntity)
    private all_resume: Repository<ResumeEntity> */
  {}

  findAll(): Promise<GameEntity[]> {
    return this.all_game.find();
  }

  /*   findAllR(): Promise<ResumeEntity[]> {
    return this.all_resume.find();
  } */

  findByName(room_name: string): Promise<GameEntity> {
    return this.all_game.findOne({
      where: {
        room_name: room_name,
      },
    });
  }

  async deleteUser(id: number): Promise<void> {
    await this.all_game.delete(id);
  }

  async delete_room_name(room_name: string): Promise<void> {
    await this.all_game.delete({ room_name });
  }
}
