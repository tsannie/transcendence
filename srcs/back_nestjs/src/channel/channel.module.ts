import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/models/user.entity';
import { ChannelController } from './controller/channel.controller';
import { ChannelEntity } from './models/channel.entity';
import { ChannelService } from './service/channel.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChannelEntity]),
    TypeOrmModule.forFeature([UserEntity])
  ],
  controllers: [ChannelController],
  providers: [ChannelService],
  exports: [ChannelService]
})
export class ChannelModule {}
