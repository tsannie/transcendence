import React from "react";
import { AuthContext, AuthContextType } from "../../contexts/AuthContext";
import { ReactComponent as MedalIcon } from "../../assets/img/icon/medal.svg";
import { ReactComponent as SearchIcon } from "../../assets/img/icon/search.svg";
import "./profile.style.scss";

function Profile() {
  const { user } = React.useContext(AuthContext) as AuthContextType;

  return (
    <div className="profile">
      <div className="profile__header">
        <div className="profile__header__user">
          <div className="profile__header__user__avatar">
            <img src={user?.profile_picture} alt="avatar" />
          </div>
          <div className="profile__header__user__info">
            <h2>{user?.username}</h2>
            <div className="profile__header__user__info__elo">
              <MedalIcon />
              <span>789 PP</span>
            </div>
          </div>
        </div>
        <div className="profile__header__search">
          <div className="profile__header__search__item">
            <SearchIcon />
            <input type="text" placeholder="Search" />
          </div>
        </div>
      </div>
      <div className="profile__stats">
        <div className="profile__stats__item"></div>
      </div>
      <div className="profile__body"></div>
    </div>
  );
}

export default Profile;
