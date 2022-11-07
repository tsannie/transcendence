import React, { useContext, useEffect, useState } from "react";
import "./profile.style.scss";
import { AuthContext, AuthContextType, User } from "../../contexts/AuthContext";
import ProfileHeader from "./ProfileHeader";
import ProfileStatsBar from "./ProfileStatsBar";
import ProfileFriends from "./ProfileFriends";
import ProfileHistory from "./ProfileHistory";
import { api } from "../../const/const";
import { useNavigate, useParams } from "react-router-dom";
import ActionBar from "./ActionBar";
import { toast } from "react-toastify";

function Profile() {
  const params = useParams().id;
  const { user } = useContext(AuthContext) as AuthContextType;
  const nav = useNavigate();

  const [player, setPlayer] = useState<User | null>(null);
  const [isload, setIsLoad] = useState<boolean>(false);
  const [isPerso, setIsPerso] = useState<boolean>(false);

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
        .catch(() => {
          toast.warning("user not found !");
          nav("/profile/" + user?.username);
        });
    }
  }, [params]);

  if (isload) {
    return (
      <div className="profile">
        <div className="profile__size" />
        <ProfileHeader player={player} />
        {!isPerso && <ActionBar player={player} />}
        <hr id="full" />
        <ProfileStatsBar player={player} />
        <hr id="full" />
        <div className="profile__body">
          <ProfileHistory player={player} />
          <ProfileFriends player={player} isPerso={isPerso} />
        </div>
      </div>
    );
  } else {
    return <>loading</>;
  }
}

export default Profile;
