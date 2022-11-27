import { AxiosResponse } from "axios";
import React, { MouseEvent, useContext, useEffect, useState } from "react";
import { api } from "../../../const/const";
import { ReactComponent as SpectateIcon } from "../../../assets/img/icon/read.svg";
import { GameContext, GameContextType } from "../../../contexts/GameContext";
import { IInfoRoom, RoomStatus } from "../const/const";
import { Link } from "react-router-dom";

function GameCurrent() {
  const { socket, setDisplayRender } = useContext(
    GameContext
  ) as GameContextType;
  const [currentRooms, setCurrentRooms] = useState<IInfoRoom[]>([]);
  let allRooms: JSX.Element[];
  //getCurrentRooms

  useEffect(() => {
    socket?.on("updateCurrentRoom", (room: IInfoRoom) => {
      const tmp = currentRooms.filter((r) => r.id !== room.id);
      setCurrentRooms(
        room.status === RoomStatus.PLAYING ? [...tmp, room] : tmp
      );
    });
  }, [socket]);

  useEffect(() => {
    api.get("game/rooms").then((res: AxiosResponse) => {
      setCurrentRooms(res.data);
    });
  }, []);

  const handleJoinRoom = (e: MouseEvent<HTMLButtonElement>, id: string) => {
    e.preventDefault();
    setDisplayRender(true);
    socket?.emit("joinRoom", id);
  };

  if (currentRooms.length) {
    allRooms = currentRooms.map((room: IInfoRoom) => {
      return (
        <div className="current__item" key={room.id}>
          <div className="current__item__info">
            <div className="current__profile-picture">
              <Link to={`/profile/${room.p1.username}`}>
                <button
                  title={room.p1.username.length > 8 ? room.p1.username : ""}
                >
                  <span>
                    {room.p1.username.length > 8
                      ? room.p1.username.slice(0, 5) + "..."
                      : room.p1.username}
                  </span>
                </button>
              </Link>
              <span id="separator"> - </span>
              <Link to={`/profile/${room.p2.username}`}>
                <button
                  title={room.p2.username.length > 8 ? room.p2.username : ""}
                >
                  <span>
                    {room.p2.username.length > 8
                      ? room.p2.username.slice(0, 5) + "..."
                      : room.p2.username}
                  </span>
                </button>
              </Link>
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
  } else {
    allRooms = [
      <div className="no-room" key="no-room">
        <span>no players in play</span>
      </div>,
    ];
  }

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
