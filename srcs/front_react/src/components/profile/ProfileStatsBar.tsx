import React, { useEffect } from "react";
import { api } from "../../const/const";
import { User } from "../../contexts/AuthContext";

interface IProps {
  player: User | null;
}

function ProfileStatsBar(props: IProps) {

  function calculWinrate() {
    if (props.player?.matches === 0)
      return 0;
    return Math.round((props.player?.wins! / props.player?.matches!) * 100);
  }

  return (
    <div className="profile__stats">
      <div className="profile__stats__item">
        <h3> {props.player?.matches} </h3>
        <span>Matches</span>
      </div>
      <div className="profile__stats__item">
        <h3> {calculWinrate() + '%'} </h3>
        <span>Win Rate</span>
      </div>
      <div className="profile__stats__item">
        <h3> {props.player?.elo} </h3>
        <span>elo</span>
      </div>
      <div className="profile__stats__item">
        <h3>54</h3>
        <span>Leaderboard</span>
      </div>
    </div>
  );
}

export default ProfileStatsBar;
