import React from "react";
import { User } from "../../contexts/AuthContext";

interface IProps {
  user: User | null;
}

function ProfileFriends(props: IProps) {
  let allFriends = props.user?.friends.map((friend, index) => {
    return <img src={friend.profile_picture + "&size=small"} alt="avatar" />;
  });

  console.log(allFriends);

  return (
    <div className="profile__body__friends">
      <div className="profile__body__friends__title">
        <h3>friends :</h3>
      </div>
      <hr id="full" />
      <div className="profile__body__friends__list">{allFriends}</div>
    </div>
  );
}

export default ProfileFriends;
