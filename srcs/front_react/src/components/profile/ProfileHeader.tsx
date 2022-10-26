import React from "react";
import { ReactComponent as MedalIcon } from "../../assets/img/icon/medal.svg";
import { User } from "../../contexts/AuthContext";
import SearchBar from "./SearchBar";

interface IProps {
  user: User | null;
}

function ProfileHeader(props: IProps) {
  return (
    <div className="profile__header">
      <div className="profile__header__user">
        <div className="profile__header__user__avatar">
          <img
            src={props.user?.profile_picture + "&size=medium"}
            alt="avatar"
          />
        </div>
        <div className="profile__header__user__info">
          <h2>{props.user?.username}</h2>
          <div className="profile__header__user__info__elo">
            <MedalIcon />
            <span>789 PP</span>
          </div>
        </div>
      </div>
      <div className="profile__header__right">
        <div className="profile__header__search">
          <span>search player:</span>
          <SearchBar />
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
