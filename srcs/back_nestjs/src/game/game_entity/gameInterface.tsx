
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

  paddleProps_left: IPaddleProps;
  paddleProps_right: IPaddleProps;
  
  player_left: IPlayer;
  player_right: IPlayer;
}

//export default IGame;