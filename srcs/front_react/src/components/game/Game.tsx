import { useContext } from "react";
import { GameContext, GameContextType } from "../../contexts/GameContext";
import { RoomStatus } from "./const/const";
import "./game.style.scss";
import GameAmical from "./menu/GameAmical";
import GameContentHeader from "./menu/GameContentHeader";
import GameCurrent from "./menu/GameCurrent";
import GameMatchmaking from "./menu/GameMatchmaking";
import GameWaiting from "./menu/GameWaiting";
import { GameRender } from "./render/Render";

export default function Game() {
  const { room, displayRender } = useContext(GameContext) as GameContextType;

  if (displayRender && room) return <GameRender />;
  else
    return (
      <div className="game" id="menu">
        <div className="game__menu">
          <GameAmical />
          <GameCurrent />
        </div>
        <div className="game__content">
          <GameContentHeader />
          {room && room.status === RoomStatus.WAITING ? (
            <GameWaiting />
          ) : (
            <GameMatchmaking />
          )}
        </div>
      </div>
    );
}
