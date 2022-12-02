import React, { useEffect, useState } from "react";
import { api } from "../../const/const";
import { User } from "../../contexts/AuthContext";

interface IProps {
  player: User;
}

function ProfileStatsBar(props: IProps) {
  const [rank, setRank] = useState(0);

  function calculWinrate() {
    if (props.player.matches === 0) return 0;
    return Math.round((props.player.wins! / props.player.matches!) * 100);
  }

  function getLeaderboardRank() {
    api.get("user/leaderboard").then((res) => {
      setRank(res.data);
    });
  }

  useEffect(() => {
    getLeaderboardRank();
  }, []);

  return (
    <div className="profile__stats">
      <div className="profile__stats__item">
        <h3 id="matches"> {props.player.matches} </h3>
        <span>Matches</span>
      </div>
      <div className="profile__stats__item">
        <h3 id="win-rate"> {calculWinrate() + "%"} </h3>
        <span>Win Rate</span>
      </div>
      <div className="profile__stats__item">
        <h3 id="elo"> {props.player.elo} </h3>
        <span>elo</span>
      </div>
      <div className="profile__stats__item">
        <h3 id="classement"> {rank} </h3>
        <span>Leaderboard</span>
      </div>
    </div>
  );
}

export default ProfileStatsBar;
