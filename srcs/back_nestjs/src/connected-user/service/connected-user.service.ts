import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConnectedUserEntity } from 'src/connected-user/connected-user.entity';
import { UserEntity } from 'src/user/models/user.entity';
import { Repository } from 'typeorm';
import { ConnectedUserDto } from '../dto/connected-user.dto';

@Injectable()
export class ConnectedUserService {

  constructor(
    @InjectRepository(ConnectedUserEntity)
    private readonly connectedUserRepository: Repository<ConnectedUserEntity>
  ) { }

  async create(connectedUser: ConnectedUserDto): Promise<ConnectedUserDto> {
    return this.connectedUserRepository.save(connectedUser);
  }

  /* async findByUser(user: ConnectedUserEntity): Promise<ConnectedUserDto[]> {
    return this.connectedUserRepository.find({ user });
  } */

  async deleteBySocketId(socketId: string) {
    return this.connectedUserRepository.delete({ socketId });
  }

  async deleteAll() {
    await this.connectedUserRepository
      .createQueryBuilder()
      .delete()
      .execute();
  }

}