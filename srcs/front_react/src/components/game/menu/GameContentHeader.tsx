import { AxiosResponse } from "axios";
import React, { useContext, useEffect, useState } from "react";
import { api } from "../../../const/const";
import { GameContext, GameContextType } from "../../../contexts/GameContext";
import { IInfoGame } from "../const/const";

function GameContentHeader() {
  const { socket, info } = useContext(GameContext) as GameContextType;

  return (
    <div className="game__content__header">
      <div className="game__content__header__title">
        <h1>play</h1>
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
