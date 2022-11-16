import { Game, User } from "../../contexts/AuthContext";
import { ReactComponent as TrophyIcon } from "../../assets/img/icon/trophy.svg";
import { useEffect, useState } from "react";
import { api } from "../../const/const";

interface IProps {
  player: User | null;
}

function ProfileHistory(props: IProps) {
  let allHistory;

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
            {/* <img
            // display picture of the opponent
              src={
                game.players[0].id === props.player?.id
                  ? game.players[1].profile_picture
                  : game.players[0].profile_picture
              } // DON'T WORK BECAUSE BACK IS RELATIONS AND I DON'T HAVE THEM
              //alt="avatar"
           > */}
            <span>
              {props.player?.id === game.winner_id ? game.p1_score : game.p2_score } - {props.player?.id === game.winner_id ? game.p2_score : game.p1_score}
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
      <div>{allHistory?.reverse()}</div>
    </div>
  );
}

export default ProfileHistory;
