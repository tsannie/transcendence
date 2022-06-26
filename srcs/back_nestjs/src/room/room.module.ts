import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomController } from './controller/room.controller';
import { RoomEntity } from './models/room.entity';
import { RoomService } from './service/room.service';

@Module({
  imports: [TypeOrmModule.forFeature([RoomEntity])],
  providers: [RoomService],
  controllers: [RoomController],
  exports: [RoomService],
})
export class RoomModule {}
