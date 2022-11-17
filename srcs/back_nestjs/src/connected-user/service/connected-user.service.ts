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
    private readonly connectedUserRepository: Repository<ConnectedUserEntity>,
  ) {}

  async create(connectedUser: ConnectedUserEntity): Promise<ConnectedUserEntity> {
    let newConnectedUser = new ConnectedUserEntity();

    newConnectedUser.socketId = connectedUser.socketId;
    newConnectedUser.user = connectedUser.user;
    return await this.connectedUserRepository.save(newConnectedUser);
  }

  async findBySocketId(socketId: string): Promise<ConnectedUserEntity> {
    return await this.connectedUserRepository.findOne({
      relations: ['user'],
      where: {
        socketId: socketId,
      },
    });
  }

  async deleteBySocketId(socketId: string) {
    return await this.connectedUserRepository.delete({ socketId });
  }
}
