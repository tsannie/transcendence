import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessageModule } from './message/message.module';
import { MessageController } from './message/controller/message.controller';
import { MessageService } from './message/service/message.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot({     // TODO create class database
      type: 'postgres',
      url: process.env.POSTGRES_FORCE,
      autoLoadEntities: true,   // TODO check that
      synchronize: true
    }),
    UserModule,
    MessageModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
