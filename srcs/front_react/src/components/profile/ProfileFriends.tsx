import userEvent from "@testing-library/user-event";
import React, { Fragment } from "react";
import { User } from "../../contexts/AuthContext";
import { ReactComponent as AddIcon } from "../../assets/img/icon/circle_check.svg";
import { ReactComponent as RemoveIcon } from "../../assets/img/icon/circle_remove.svg";
import { Link } from "react-router-dom";

interface IProps {
  player: User | null;
  isPerso: boolean;
}

function ProfileFriends(props: IProps) {
  let allFriendRequests;
  let allFriends = props.player?.friends.map((friend, index) => {
    return (
      <img
        key={index}
        src={friend.profile_picture + "&size=small"}
        alt="avatar"
      />
    );
  });

  if (props.isPerso) {
    allFriendRequests = props.player?.friend_requests.map((request, index) => {
      return (
        <Fragment key={index}>
          <div className="friend__request__item">
            <div className="info__request">
              <Link to={"/profile/" + request.username}>
                <img
                  src={request.profile_picture + "&size=small"}
                  alt="avatar"
                />
              </Link>
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
        <span>{props.player?.friends.length}</span>
      </div>
      <hr id="full" />
      {props.isPerso && props.player?.friend_requests ? (
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
