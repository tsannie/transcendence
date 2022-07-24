import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelController } from './controller/channel.controller';
import { ChannelEntity } from './models/channel.entity';
import { ChannelService } from './service/channel.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChannelEntity])
  ],
  controllers: [ChannelController],
  providers: [ChannelService]
})
export class ChannelModule {}
