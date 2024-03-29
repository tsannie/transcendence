import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelEntity } from 'src/channel/models/channel.entity';
import { MessageEntity } from 'src/message/models/message.entity';
import { UserEntity } from 'src/user/models/user.entity';
import { UserModule } from 'src/user/user.module';
import { DmController } from './controller/dm.controller';
import { DmEntity } from './models/dm.entity';
import { DmService } from './service/dm.service';

@Module({
  imports: [
    forwardRef(() => UserModule),
    TypeOrmModule.forFeature([
      DmEntity,
      ChannelEntity,
      UserEntity,
      MessageEntity,
    ]),
  ],
  controllers: [DmController],
  providers: [DmService],
  exports: [DmService],
})
export class DmModule {}
