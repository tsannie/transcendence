import React, { useContext } from "react";
import "./profile.style.scss";
import { AuthContext, AuthContextType } from "../../contexts/AuthContext";
import ProfileHeader from "./ProfileHeader";
import ProfileStatsBar from "./ProfileStatsBar";
import { ReactComponent as TrophyIcon } from "../../assets/img/icon/trophy.svg";

function Profile() {
  const { user } = useContext(AuthContext) as AuthContextType;

  /*let items = ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"];
  let itemList:any = [];

  items.forEach((item,index)=>{
    itemList.push( <li key={index}>{item}</li>)
  })*/

  return (
    <div className="profile">
      <ProfileHeader user={user} />
      <hr id="full" />
      <ProfileStatsBar user={user} />
      <hr id="full" />
      <div className="profile__body">
        <div className="profile__body__history">
          <div className="profile__body__history__title">
            <h3>recent games:</h3>
          </div>
          <hr id="full" />
          <div className="profile__body__history__list">
            <div className="profile__body__history__item">
              <div className="trophy-indicator"></div>
              <div className="info">
                <span>defeat</span>
                <div className="info__elo">-22PP</div>
              </div>
              <img src={user?.profile_picture + "&size=small"} alt="avatar" />
              <span>6-10</span>
            </div>
            <hr />
            <div className="profile__body__history__item">
              <div className="trophy-indicator">
                <TrophyIcon />
              </div>
              <div className="info">
                <span>victory</span>
                <div className="info__elo">+22PP</div>
              </div>
              <img src={user?.profile_picture + "&size=small"} alt="avatar" />
              <span>10-7</span>
            </div>
            <hr />
          </div>
        </div>
        <div className="profile__body__friends">
          <div className="profile__body__friends__title">
            <h3>friends :</h3>
          </div>
          <hr id="full" />
          <div className="profile__body__friends__list">
            <img src={user?.profile_picture + "&size=small"} alt="avatar" />
            <img src={user?.profile_picture + "&size=small"} alt="avatar" />
            <img src={user?.profile_picture + "&size=small"} alt="avatar" />
            <img src={user?.profile_picture + "&size=small"} alt="avatar" />
            <img src={user?.profile_picture + "&size=small"} alt="avatar" />
            <img src={user?.profile_picture + "&size=small"} alt="avatar" />
            <img src={user?.profile_picture + "&size=small"} alt="avatar" />
            <img src={user?.profile_picture + "&size=small"} alt="avatar" />
            <img src={user?.profile_picture + "&size=small"} alt="avatar" />
            <img src={user?.profile_picture + "&size=small"} alt="avatar" />
            <img src={user?.profile_picture + "&size=small"} alt="avatar" />
            <img src={user?.profile_picture + "&size=small"} alt="avatar" />
            <img src={user?.profile_picture + "&size=small"} alt="avatar" />
            <img src={user?.profile_picture + "&size=small"} alt="avatar" />
            <img src={user?.profile_picture + "&size=small"} alt="avatar" />
            <img src={user?.profile_picture + "&size=small"} alt="avatar" />
            <img src={user?.profile_picture + "&size=small"} alt="avatar" />
            <img src={user?.profile_picture + "&size=small"} alt="avatar" />
            <img src={user?.profile_picture + "&size=small"} alt="avatar" />
            <img src={user?.profile_picture + "&size=small"} alt="avatar" />
            <img src={user?.profile_picture + "&size=small"} alt="avatar" />
            <img src={user?.profile_picture + "&size=small"} alt="avatar" />
            <img src={user?.profile_picture + "&size=small"} alt="avatar" />
            <img src={user?.profile_picture + "&size=small"} alt="avatar" />
            <img src={user?.profile_picture + "&size=small"} alt="avatar" />
            <img src={user?.profile_picture + "&size=small"} alt="avatar" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
