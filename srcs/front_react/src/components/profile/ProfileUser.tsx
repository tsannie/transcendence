import React, { useContext } from "react";
import "./profile.style.scss";
import { AuthContext, AuthContextType } from "../../contexts/AuthContext";
import ProfileHeader from "./ProfileHeader";
import ProfileStatsBar from "./ProfileStatsBar";
import ProfileFriends from "./ProfileFriends";
import ProfileHistory from "./ProfileHistory";
import { useParams } from "react-router-dom";

function ProfileUser() {
  const { user } = useContext(AuthContext) as AuthContextType;

  return (
    <div className="profile">
      <ProfileHeader user={user} />
      <hr id="full" />
      <ProfileStatsBar user={user} />
      <hr id="full" />
      <div className="profile__body">
        <ProfileHistory user={user} />
        <ProfileFriends user={user} />
      </div>
    </div>
  );
}

export default ProfileUser;
