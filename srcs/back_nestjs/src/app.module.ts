import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessageModule } from './message/message.module';
import { MessageService } from './message/service/message.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/service/auth.service';
import { UserService } from './user/service/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from './user/models/user.entity';
import { PassportModule } from '@nestjs/passport';
import { MessageEntity } from './message/models/message.entity';
import { ChannelController } from './channel/controller/channel.controller';
import { ChannelModule } from './channel/channel.module';
import { GameModule } from './game/game.module';
import { TwoFactorService } from './two-factor/service/two-factor.service';
import { TwoFactorController } from './two-factor/controller/two-factor.controller';
import { DmController } from './dm/controller/dm.controller';
import { DmService } from './dm/service/dm.service';
import { DmModule } from './dm/dm.module';
import { HttpModule } from '@nestjs/axios';
import { TwoFactorModule } from './two-factor/two-factor.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.POSTGRES_FORCE,
      autoLoadEntities: true,
      synchronize: true,
    }),
    HttpModule,
    UserModule,
    AuthModule,
    PassportModule,
    GameModule,
    ChannelModule,
    MessageModule,
    DmModule,
    TwoFactorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
