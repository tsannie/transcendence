import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../../../contexts/AuthContext";
import { GameMode, RoomStatus } from "../const/const";
import { GameContext, GameContextType } from "../../../contexts/GameContext";
import { ICreateRoom } from "../types";

export default function GameMenu() {
  const { socket, room } = useContext(GameContext) as GameContextType;
  const { user } = useContext(AuthContext);

  let game_mode = GameMode.PONG_1972;

  function matchmakingClassic() {
    let data: ICreateRoom = {
      mode: game_mode,
    };

    if (!room) {
      console.log("socket id == ", socket?.id);
      socket?.emit("matchmaking", data);
      toast.success("Room created !");
    }
  }

  function matchmakingTrans() {
    game_mode = GameMode.PONG_TRANS;
    matchmakingClassic();
  }

  return (
    <div className="Game">
      {!room && (
        <div className="GameMenu">
          <h2> you are : {user?.username} </h2>
          <br />
          <button onClick={matchmakingClassic}>pong classic</button>
          <br />
          <br />
          <button onClick={matchmakingTrans}>pong transcendence</button>
        </div>
      )}
    </div>
  );
}
