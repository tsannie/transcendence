import { AxiosResponse } from "axios";
import React, { MouseEvent, useContext, useEffect, useState } from "react";
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

  const handleJoinRoom = (e: MouseEvent<HTMLButtonElement>, id: string) => {
    e.preventDefault();
    socket?.emit("joinRoom", id);
  };

  let allRooms = currentRooms.map((room: IInfoRoom) => {
    return (
      <div className="current__item" key={room.id}>
        <div className="current__item__info">
          <div className="current__pseudo">
            <span>
              {room.p1.username.substring(0, 10)}
              {room.p1.username.length > 10 ? "..." : ""}-
              {room.p2.username.substring(0, 10)}
              {room.p2.username.length > 10 ? "..." : ""}
            </span>
          </div>
          <div className="current__score">
            <span>
              {room.p1_score} : {room.p2_score}
            </span>
          </div>
        </div>
        <div className="current__item__spectate">
          <button
            onClick={(e: MouseEvent<HTMLButtonElement>) =>
              handleJoinRoom(e, room.id)
            }
          >
            <SpectateIcon />
          </button>
        </div>
      </div>
    );
  });

  return (
    <div className="current">
      <div className="game__menu__item__header">
        <h2>current</h2>
      </div>
      <div className="current__list">{allRooms}</div>
    </div>
  );
}

export default GameCurrent;
