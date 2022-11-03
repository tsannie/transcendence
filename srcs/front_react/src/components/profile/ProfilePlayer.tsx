import React, { useContext, useEffect, useState } from "react";
import "./profile.style.scss";
import { AuthContext, AuthContextType, User } from "../../contexts/AuthContext";
import ProfileHeader from "./ProfileHeader";
import ProfileStatsBar from "./ProfileStatsBar";
import ProfileFriends from "./ProfileFriends";
import ProfileHistory from "./ProfileHistory";
import { api } from "../../const/const";
import { useParams } from "react-router-dom";
import PageNotFound from "../menu/PageNotFound";

function ProfilePlayer() {
  const params = useParams().id;
  const { user } = useContext(AuthContext) as AuthContextType;

  const [player, setPlayer] = useState<User | null>(null);
  const [isload, setIsLoad] = useState<boolean>(false);
  const [isPerso, setIsPerso] = useState<boolean>(params ? false : true);
  const [notFound, setNotFound] = useState<boolean>(false);

  useEffect(() => {
    if (isPerso) {
      setPlayer(user);
      setIsLoad(true);
    } else {
      api
        .get("/user/username", { params: { username: params } })
        .then((res) => {
          setPlayer(res.data as User);
          setIsLoad(true);
        })
        .catch((err) => {
          console.log("error");
          setNotFound(true);
        });
    }
  }, []);

  if (notFound) {
    return <PageNotFound redirection="/profile" objectNotFound="player" />;
  }

  if (isload) {
    return (
      <div className="profile">
        <ProfileHeader user={player} />
        <hr id="full" />
        <ProfileStatsBar user={player} />
        <hr id="full" />
        <div className="profile__body">
          <ProfileHistory user={player} />
          <ProfileFriends user={player} />
        </div>
      </div>
    );
  } else {
    return <>loading</>;
  }
}

export default ProfilePlayer;
