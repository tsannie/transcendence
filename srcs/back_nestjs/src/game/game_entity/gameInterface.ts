
interface IBallObj {
  x: number;
  y: number;
}

interface IPaddleProps {
  height: number;
  width: number;

  x: number;
  y: number;
}

interface IPlayer {
  name: string;
  score: number;
  won: boolean;
}

export interface IGame {
  ballObj: IBallObj;

  paddleProps_p1: IPaddleProps;
  paddleProps_p2: IPaddleProps;
  
  player_p1: IPlayer;
  player_p2: IPlayer;
}

//export default IGame;