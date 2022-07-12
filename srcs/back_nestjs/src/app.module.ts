import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessageModule } from './message/message.module';
import { MessageController } from './message/controller/message.controller';
import { MessageService } from './message/service/message.service';
import { UserModule } from './user/user.module';
//import { AuthResolver } from './auth/auth.resolver';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/service/auth.service';
import { UserService } from './user/service/user.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserEntity } from './user/models/user.entity';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './auth/strategy/local.strategy';
import { MessageEntity } from './message/models/message.entity';
import { ChannelController } from './channel/controller/channel.controller';
import { ChannelService } from './channel/service/channel.service';
import { ChannelModule } from './channel/channel.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      // TODO create class database
      type: 'postgres',
      url: process.env.POSTGRES_FORCE,
      autoLoadEntities: true, // TODO check that
      synchronize: true,
    }),
    MessageModule,
    TypeOrmModule.forFeature([UserEntity]),
    UserModule,
    AuthModule,
    PassportModule,
    ChannelModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtService,
    AuthService,
    UserService,
    LocalStrategy,
    ChannelService,
  ], // AuthResolver
})
export class AppModule {}
