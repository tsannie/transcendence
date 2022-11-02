import React, { useContext, useEffect, useState } from "react";
import "./profile.style.scss";
import { AuthContext, AuthContextType, User } from "../../contexts/AuthContext";
import ProfileHeader from "./ProfileHeader";
import ProfileStatsBar from "./ProfileStatsBar";
import ProfileFriends from "./ProfileFriends";
import ProfileHistory from "./ProfileHistory";
import { api } from "../../const/const";
import { useParams } from "react-router-dom";

function ProfilePlayer() {
  const [user, setUser] = useState<User | null>(null);
  const [isload, setIsLoad] = useState<boolean>(false);
  const params = useParams().id;

  useEffect(() => {
    api
      .get("/user/username", { params: { username: params } })
      .then((res) => {
        setUser(res.data as User);
        setIsLoad(true);
      })
      .catch((err) => {
        console.log("error");
      });
  }, []);

  if (isload) {
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
  } else {
    return <>loading</>;
  }
}

export default ProfilePlayer;
