import React, { useContext, useEffect } from "react";
import { User } from "../../../contexts/AuthContext";
import { GameContext, GameContextType } from "../../../contexts/GameContext";

function GameAmical() {
  const { socket } = useContext(GameContext) as GameContextType;

  /*useEffect(() => {
    socket?.on("friendsLog", (friends: User[]) => {
      console.log("friendsLogReceived");
    });
  }, [socket]);

  useEffect(() => {
    console.log("getFriendsLog");
    socket?.emit("getFriendsLog");
  }, []);*/

  return (
    <div className="amical">
      <div className="game__menu__item__header">
        <h2>amical</h2>
      </div>
    </div>
  );
}

export default GameAmical;
