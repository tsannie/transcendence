import { Controller, Get } from '@nestjs/common';
import { GameEntity } from '../game_entity/game.entity';
import { GameService } from '../game_service/game.service';

@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

/*   @Get()
  getHello(): string {
    return this.gameService.getHello();
  } */
  @Get()
  index() : Promise<GameEntity[]> {

/*           for (let x = 0; x < 400; x++)
      {
          this.tchatService.deleteUser(x);
      }
      console.log('after delte');  */
/*
      this.tchatService.createTchat('phbarrad', 'Ca va ?', new Date("2020-12-12"), new Date("2020-12-12")) */ 
     //  this.tchatService.createTchat('jjj', 'Ca roule ?')
      //this.tchatService.createTchat('q23', 'Ca boue ?') 


      //this.tchatService.discuss("m1", "m2");
     // for (let x = -10; x < 180; x++)
       // this.gameService.deleteUser(x)
      
      return (this.gameService.findAll());
  }
}
////