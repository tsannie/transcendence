import React from "react";
import "./profile.style.scss";
import { AuthContext, AuthContextType } from "../../contexts/AuthContext";
import ProfileHeader from "./ProfileHeader";
import ProfileStatsBar from "./ProfileStatsBar";

function Profile() {
  const { user } = React.useContext(AuthContext) as AuthContextType;

  /*let items = ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"];
  let itemList:any = [];

  items.forEach((item,index)=>{
    itemList.push( <li key={index}>{item}</li>)
  })*/

  return (
    <div className="profile">
      <ProfileHeader user={user} />
      <hr />
      <ProfileStatsBar user={user} />
      <hr />
      <div className="profile__body">
        <div className="profile__body__history">
          <h3>recent games:</h3>
          <hr />

          <div className="profile__body__history__list">

            <div className="profile__body__history__item">
              <span>victory</span>
              <img src={user?.profile_picture + "&size=small"} alt="avatar" />
              <span>10-5</span>
            </div>
            <hr />
            <div className="profile__body__history__item">
              <img src={user?.profile_picture + "&size=small"} alt="avatar" />
              <span>10-5</span>
            </div>
            <hr />
            <div className="profile__body__history__item">
              <img src={user?.profile_picture + "&size=small"} alt="avatar" />
              <span>10-5</span>
            </div>
            <hr />
            <div className="profile__body__history__item">
              <img src={user?.profile_picture + "&size=small"} alt="avatar" />
              <span>10-5</span>
            </div>
            <hr />
            <div className="profile__body__history__item">
              <img src={user?.profile_picture + "&size=small"} alt="avatar" />
              <span>10-5</span>
            </div>
            <hr />
            <div className="profile__body__history__item">
              <img src={user?.profile_picture + "&size=small"} alt="avatar" />
              <span>10-5</span>
            </div>
            <hr />
            <div className="profile__body__history__item">
              <img src={user?.profile_picture + "&size=small"} alt="avatar" />
              <span>10-5</span>
            </div>
            <hr />

          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
