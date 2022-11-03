import userEvent from "@testing-library/user-event";
import React, { Fragment } from "react";
import { User } from "../../contexts/AuthContext";
import { ReactComponent as AddIcon } from "../../assets/img/icon/circle_check.svg";
import { ReactComponent as RemoveIcon } from "../../assets/img/icon/circle_remove.svg";

interface IProps {
  user: User | null;
  isPerso: boolean;
}

function ProfileFriends(props: IProps) {
  let allFriendRequests;
  let allFriends = props.user?.friends.map((friend, index) => {
    return (
      <img
        key={index}
        src={friend.profile_picture + "&size=small"}
        alt="avatar"
      />
    );
  });

  if (props.isPerso) {
    allFriendRequests = props.user?.friend_requests.map((request, index) => {
      return (
        <Fragment key={index}>
          <div className="friend__request__item">
            <div className="info__request">
              <img src={request.profile_picture + "&size=small"} alt="avatar" />
              <span>
                {request.username.substring(0, 10)}
                {request.username.length > 10 ? "..." : ""}
              </span>
            </div>
            <AddIcon />
            <RemoveIcon />
          </div>
          <hr />
        </Fragment>
      );
    });
  }

  return (
    <div className="profile__body__friends">
      <div className="profile__body__friends__title">
        <h3>friends </h3>
        <span>{props.user?.friends.length}</span>
      </div>
      <hr id="full" />
      {props.isPerso && props.user?.friend_requests ? (
        <div className="profile__body__friend__request">
          {allFriendRequests}
        </div>
      ) : (
        <div className="profile__body__friends__list">{allFriends}</div>
      )}
    </div>
  );
}

export default ProfileFriends;
