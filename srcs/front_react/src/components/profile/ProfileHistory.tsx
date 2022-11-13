import React from "react";
import { User } from "../../contexts/AuthContext";
import { ReactComponent as TrophyIcon } from "../../assets/img/icon/trophy.svg";

interface IProps {
  player: User | null;
}

function ProfileHistory(props: IProps) {
  return (
    <div className="profile__body__history">
      <div className="profile__body__history__title">
        <h3>recent games</h3>
      </div>
      <hr id="full" />
      <div className="profile__body__history__list">
        <div className="profile__body__history__item">
          <div className="trophy-indicator"></div>
          <div className="info">
            <span>defeat</span>
            <div className="info__elo">-22PP</div>
          </div>
          <img
            src={props.player?.profile_picture + "&size=small"}
            alt="avatar"
          />
          <span>6-10</span>
        </div>
        <hr />
        <div className="profile__body__history__item">
          <div className="trophy-indicator">
            <TrophyIcon />
          </div>
          <div className="info">
            <span>victory</span>
            <div className="info__elo">+22PP</div>
          </div>
          <img
            src={props.player?.profile_picture + "&size=small"}
            alt="avatar"
          />
          <span>10-7</span>
        </div>
        <hr />
      </div>
    </div>
  );
}

export default ProfileHistory;
