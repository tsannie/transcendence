import { useContext } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../../../contexts/AuthContext";
import { GameContext, GameContextType } from "../../../contexts/GameContext";
import { GameMode } from "../const/const";
import { ICreateRoom } from "../types";

export default function GameMenu() {
  const { socket, room } = useContext(GameContext) as GameContextType;
  const { user } = useContext(AuthContext);

  let game_mode = GameMode.CLASSIC;

  function matchmakingClassic() {
    let data: ICreateRoom = {
      mode: game_mode,
    };

    if (!room && socket) {
      socket.emit("matchmaking", data);
      toast.info("join matchmaking ...");
    }
  }

  function matchmakingTrans() {
    game_mode = GameMode.TRANS;
    matchmakingClassic();
  }

  return (
    <div className="game">
      {!room && (
        <div className="GameMenu">
          <h2> you are : {user?.username} </h2>
          <br />
          <button onClick={matchmakingClassic}>classic</button>
          <br />
          <br />
          <button onClick={matchmakingTrans}>pong transcendence</button>
        </div>
      )}
    </div>
  );
}
