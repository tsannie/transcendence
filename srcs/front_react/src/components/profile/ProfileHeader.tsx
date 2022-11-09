import React from "react";
import { ReactComponent as MedalIcon } from "../../assets/img/icon/medal.svg";
import { User } from "../../contexts/AuthContext";
import SearchBar from "./SearchBar";

interface IProps {
  player: User | null;
}

function ProfileHeader(props: IProps) {
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
            <div className="elo">
              <div className="elo__item">
                <MedalIcon />
                <span>789 PP</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="profile__header__right">
        <span>search player:</span>
        <div className="profile__header__search">
          <SearchBar />
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
