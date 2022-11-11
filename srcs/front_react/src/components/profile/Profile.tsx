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
import { AxiosResponse } from "axios";
import { ChatDisplayContext, ChatDisplayProvider } from "../../contexts/ChatDisplayContext";

function Profile() {
  const params = useParams().id;
  const { user, setReloadUser } = useContext(AuthContext) as AuthContextType;
  const nav = useNavigate();

  const [player, setPlayer] = useState<User | null>(null);
  const [isLoad, setisLoad] = useState<boolean>(false);
  const [isPerso, setIsPerso] = useState<boolean>(false);
  const [reloadPlayer, setReloadPlayer] = useState<boolean>(false);

  useEffect(() => {
    const perso = params === user?.username ? true : false;
    setIsPerso(perso);

    if (perso) {
      setPlayer(user);
      setisLoad(true);
    } else {
      api
        .get("/user/username", { params: { username: params } })
        .then((res: AxiosResponse) => {
          setPlayer(res.data as User);
          setisLoad(true);
        })
        .catch(() => {
          toast.warning("user not found !");
          nav("/profile/" + user?.username);
        });
    }
    setReloadPlayer(false);
  }, [params]);

  useEffect(() => {
    if (player && isPerso && isLoad) setPlayer(user);
  }, [user]);

  useEffect(() => {
    if (reloadPlayer && player && isLoad) {
      if (isPerso) {
        setReloadUser(true);
      } else {
        api
          .get("/user/username", { params: { username: params } })
          .then((res: AxiosResponse) => {
            setPlayer(res.data as User);
          })
          .catch(() => {
            console.log("error update user");
          });
      }
      setReloadPlayer(false);
    }
  }, [reloadPlayer]);

  if (isLoad) {
    return (
      <div className="profile">
        <div className="profile__size" />
        <ProfileHeader player={player} />
        {!isPerso && (
            <ActionBar player={player} setReloadPlayer={setReloadPlayer} />
        )}
        <hr id="full" />
        <ProfileStatsBar player={player} />
        <hr id="full" />
        <div className="profile__body">
          <ProfileHistory player={player} />
          <ProfileFriends
            player={player}
            isPerso={isPerso}
            setReloadPlayer={setReloadPlayer}
          />
        </div>
      </div>
    );
  } else {
    return <>loading</>;
  }
}

export default Profile;
