import { AxiosResponse } from "axios";
import React, { useContext, useEffect, useState } from "react";
import { api } from "../../../const/const";
import { User } from "../../../contexts/AuthContext";
import { ReactComponent as BallIcon } from "../../../assets/img/icon/full_ball.svg";
import { ReactComponent as BallTransIcon } from "../../../assets/img/icon/ball-reverse.svg";
import { GameContext, GameContextType } from "../../../contexts/GameContext";
import { Link } from "react-router-dom";

function GameAmical() {
  const { socket } = useContext(GameContext) as GameContextType;
  const [friendsLog, setFriendsLog] = useState<User[]>([]);

  let allFriends: JSX.Element[];

  useEffect(() => {
    socket?.on("friendsLogin", (friend: User) => {
      const tmp = friendsLog.filter((f) => f.id !== friend.id);
      setFriendsLog([...tmp, friend]);
    });

    socket?.on("friendsLogout", (friend: User) => {
      setFriendsLog((friendsLog: User[]) =>
        friendsLog.filter((friend: User) => friend.id !== friend.id)
      );
    });
  }, [socket]);

  useEffect(() => {
    api
      .get("/game/friends-log")
      .then((res: AxiosResponse) => {
        setFriendsLog(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  if (friendsLog.length) {
    allFriends = friendsLog.map((friend: User) => {
      return (
        <div className="duel__list__item">
          <div className="duel__list__item__info">
            <Link to={`/profile/${friend.username}`}>
              <button>
                <img src={friend.profile_picture} alt="avatar" />
              </button>
            </Link>
            <span title={friend.username.length > 10 ? friend.username : ""}>
              {friend.username.length > 10
                ? friend.username.slice(0, 7) + "..."
                : friend.username}
            </span>
          </div>
          <div className="duel__list__item__action">
            <button id="classic" title="Invite in classic mode">
              <BallIcon />
            </button>
            <button id="trans" title="Invite in trans mode">
              <BallTransIcon />
            </button>
          </div>
        </div>
      );
    });
  } else {
    allFriends = [
      <div className="no-room" key="no-room">
        <span>no friends connected</span>
      </div>,
    ];
  }

  return (
    <div className="amical">
      <div className="game__menu__item__header">
        <h2>amical</h2>
      </div>
      <div className="duel__list">{allFriends}</div>
    </div>
  );
}

export default GameAmical;
