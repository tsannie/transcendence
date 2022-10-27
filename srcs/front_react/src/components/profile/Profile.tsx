import React from "react";
import "./profile.style.scss";
import { AuthContext, AuthContextType } from "../../contexts/AuthContext";
import ProfileHeader from "./ProfileHeader";
import ProfileStatsBar from "./ProfileStatsBar";

function Profile() {
  const { user } = React.useContext(AuthContext) as AuthContextType;

  let items= ['Item 1','Item 2','Item 3','Item 4','Item 5'];

  return (
    <div className="profile">
      <ProfileHeader user={user}/>
      <hr />
      <ProfileStatsBar user={user}/>
      <hr />
      <div className="profile__body"></div>
    </div>
  );
}

export default Profile;
