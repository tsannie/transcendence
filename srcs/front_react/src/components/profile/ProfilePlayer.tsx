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
  const [isPerso, setIsPerso] = useState<boolean>(false);
  const [notFound, setNotFound] = useState<boolean>(false);

  useEffect(() => {
    const perso = params === user?.username ? true : false;
    setIsPerso(perso);

    if (perso) {
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
  }, [params]);

  if (notFound) {
    return <PageNotFound redirection="/profile" objectNotFound="player" />;
  }

  if (isload) {
    return (
      <div className="profile">
        <div className="profile__size" />
        <ProfileHeader user={player} />
        <hr id="full" />
        <ProfileStatsBar user={player} />
        <hr id="full" />
        <div className="profile__body">
          <ProfileHistory user={player} />
          <ProfileFriends user={player} isPerso={isPerso} />
        </div>
      </div>
    );
  } else {
    return <>loading</>;
  }
}

export default ProfilePlayer;
