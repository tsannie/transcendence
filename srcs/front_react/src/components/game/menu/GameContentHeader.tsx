import React, { useContext, useEffect, useState } from "react";
import { GameContext, GameContextType } from "../../../contexts/GameContext";
import { IInfoGame } from "../const/const";

function GameContentHeader() {
  const { socket } = useContext(GameContext) as GameContextType;
  const [info, setInfo] = useState<IInfoGame>();

  useEffect(() => {
    socket?.on("infoGame", (info: IInfoGame) => {
      setInfo(info);
    });
  }, [socket]);

  useEffect(() => {
    socket?.emit("getInfoGame");
  }, []);

  return (
    <div className="game__content__header">
      <div className="game__content__header__title">
        <h1>game</h1>
      </div>
      <div className="game__content__header__stat">
        <div className="stat__item">
          <h3>{info?.search}</h3>
          <span>search</span>
        </div>
        <div className="stat__item">
          <h3>{info?.ingame}</h3>
          <span>ingame</span>
        </div>
        <div className="stat__item">
          <h3>{info?.online}</h3>
          <span>online</span>
        </div>
      </div>
    </div>
  );
}

export default GameContentHeader;
