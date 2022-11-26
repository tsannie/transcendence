import { AxiosResponse } from "axios";
import React, { useContext, useEffect, useState } from "react";
import { api } from "../../../const/const";
import { ReactComponent as SpectateIcon } from "../../../assets/img/icon/read.svg";
import { GameContext, GameContextType } from "../../../contexts/GameContext";
import { IInfoRoom } from "../const/const";

function GameCurrent() {
  const { socket } = useContext(GameContext) as GameContextType;
  const [currentRooms, setCurrentRooms] = useState<IInfoRoom[]>([]);
  //getCurrentRooms

  useEffect(() => {
    api.get("game/rooms").then((res: AxiosResponse) => {
      setCurrentRooms(res.data);
    });
  }, []);

  return (
    <div className="current">
      <div className="game__menu__item__header">
        <h2>current</h2>
      </div>
      <div className="current__item">
        <div className="current__item__pseudo">
          <span className="pseudo">tsannieeeeeeeeeeeeeeeeeeeeee</span>
          <span>-</span>
          <span className="pseudo">gpetittttttttttttttttttt</span>
        </div>
        <div className="current__score">
          <span>10 - 7</span>
        </div>
        <button>
          <SpectateIcon />
        </button>
      </div>
    </div>
  );
}

export default GameCurrent;
