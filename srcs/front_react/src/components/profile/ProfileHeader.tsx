import React, { useContext, useEffect, useState } from "react";
import { ReactComponent as MedalIcon } from "../../assets/img/icon/medal.svg";
import { AuthContext, AuthContextType, User } from "../../contexts/AuthContext";
import { GameContext, GameContextType } from "../../contexts/GameContext";
import SearchBarPlayer from "./SearchBarPlayer";

interface IProps {
  player: User;
}

function ProfileHeader(props: IProps) {
  const [status, setStatus] = useState<string>("Private");
  const { friendsLog } = useContext(GameContext) as GameContextType;
  const { user } = useContext(AuthContext) as AuthContextType;

  useEffect(() => {
    if (friendsLog) {
      const isOnline = friendsLog.find((friend) => {
        return friend.id === props.player.id;
      });
      console.log(isOnline);
      if (isOnline) {
        setStatus("Online");
      } else {
        setStatus("Offline");
      }
    }
  }, [friendsLog, user]);

  return (
    <div className="profile__header">
      <div className="profile__header__user">
        <div className="profile__header__user__avatar">
          <img
            src={props.player?.profile_picture + "&size=large"}
            alt="avatar"
          />
        </div>
        <div className="profile__header__user__info">
          <div className="name">
            <h2>{props.player?.username}</h2>
          </div>
          <div className="info__player">
            <span>{status}</span>
          </div>
        </div>
      </div>
      <div className="profile__header__right">
        <span>search player:</span>
        <div className="profile__header__search">
          <SearchBarPlayer />
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
