import React, { useEffect } from "react";
import { api } from "../../const/const";
import { User } from "../../contexts/AuthContext";

interface IProps {
  player: User | null;
}

function ProfileStatsBar(props: IProps) {

  const [stat, setStat] = React.useState({});

  console.log(props.player);
  useEffect(() => {
    api.get("user/stat").then((res) => {
      setStat(res.data);
    })
    .catch(() => {
      console.log("error");
    });

  }, [props.player]);

  return (
    <div className="profile__stats">
      <div className="profile__stats__item">
        <h3>1254</h3>
        <span>Matches</span>
      </div>
      <div className="profile__stats__item">
        <h3>64%</h3>
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
