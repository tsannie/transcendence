import React, { useContext } from "react";
import "./profile.style.scss";
import { AuthContext, AuthContextType } from "../../contexts/AuthContext";
import ProfileHeader from "./ProfileHeader";
import ProfileStatsBar from "./ProfileStatsBar";
import ProfileFriends from "./ProfileFriends";
import ProfileHistory from "./ProfileHistory";

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
        <ProfileHistory user={user} />
        <ProfileFriends user={user} />
      </div>
    </div>
  );
}

export default Profile;
