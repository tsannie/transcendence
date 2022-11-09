import React from "react";
import { User } from "../../contexts/AuthContext";

interface IProps {
  player: User | null;
}

function ProfileStatsBar(props: IProps) {
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
        <h3>789</h3>
        <span>elo</span>
      </div>
      <div className="profile__stats__item">
        <h3>54</h3>
        <span>Classement</span>
      </div>
    </div>
  );
}

export default ProfileStatsBar;
