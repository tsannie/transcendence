import React, { useEffect } from "react";
import { User } from "../../contexts/AuthContext";
import { ReactComponent as TrophyIcon } from "../../assets/img/icon/trophy.svg";
import { api } from "../../const/const";

interface IProps {
  player: User | null;
}

function ProfileHistory(props: IProps) {
  let allHistory;
  console.log(props.player?.history);

  if (props.player?.history.length !== 0) {
    allHistory = props.player?.history.map((game, index) => {
      return (
        <li className="profile__body__history__list" key={index}>
          <div className="profile__body__history__item">
            <div className="trophy-indicator">
              {game.winner_id === props.player?.id ? <TrophyIcon /> : null}
            </div>
            <div className="info">
              <span>
                {props.player?.id === game.winner_id ? "victory" : "defeat"}
              </span>
              <div className="info__elo">
                {props.player?.id === game.winner_id
                  ? game.eloDiff
                  : -game.eloDiff}
              </div>
            </div>
            <img
              src={props.player?.profile_picture + "&size=small"}
              alt="avatar"
            />
            <span>
              {game.p1_score} - {game.p2_score}
            </span>
          </div>
        </li>
      );
    });
  }
  return (
    <div className="profile__body__history">
      <div className="profile__body__history__title">
        <h3>recent games</h3>
      </div>
      <div>{allHistory}</div>
    </div>
  );
}

export default ProfileHistory;
