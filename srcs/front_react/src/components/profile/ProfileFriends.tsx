import userEvent from "@testing-library/user-event";
import React from "react";
import { User } from "../../contexts/AuthContext";

interface IProps {
  user: User | null;
  isPerso: boolean;
}

function ProfileFriends(props: IProps) {
  let allFriends = props.user?.friends.map((friend, index) => {
    return (
      <img
        key={index}
        src={friend.profile_picture + "&size=small"}
        alt="avatar"
      />
    );
  });

  console.log(props.user?.friend_requests);

  return (
    <div className="profile__body__friends">
      <div className="profile__body__friends__title">
        <h3>friends </h3>
        <span>{props.user?.friends.length}</span>
      </div>
      <hr id="full" />
      {props.isPerso && props.user?.friend_requests ? (
        <>test</>
      ) : (
        <div className="profile__body__friends__list">{allFriends}</div>
      )}
    </div>
  );
}

export default ProfileFriends;
