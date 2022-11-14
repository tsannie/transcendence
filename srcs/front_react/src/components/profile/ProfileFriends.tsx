import userEvent from "@testing-library/user-event";
import React, { Fragment, MouseEvent, useContext } from "react";
import { AuthContext, AuthContextType, User } from "../../contexts/AuthContext";
import { ReactComponent as AddIcon } from "../../assets/img/icon/circle_check.svg";
import { ReactComponent as RemoveIcon } from "../../assets/img/icon/circle_remove.svg";
import { Link } from "react-router-dom";
import { api } from "../../const/const";
import { toast } from "react-toastify";

interface IProps {
  player: User | null;
  isPerso: boolean;
  setReloadPlayer: (reload: boolean) => void;
}

function ProfileFriends(props: IProps) {
  let allFriendRequests;
  let allFriends = props.player?.friends.map((friend, index) => {
    return (
      <Link to={"/profile/" + friend.username} key={index}>
        <img src={friend.profile_picture + "&size=small"} alt="avatar" />
      </Link>
    );
  });

  const handleRefuseRequest = (
    e: MouseEvent<HTMLButtonElement>,
    id: string
  ) => {
    e.preventDefault();
    api
      .post("/user/refuse-friend-request", { id: id })
      .then(() => {
        toast.success("friend request refused");
        props.setReloadPlayer(true);
      })
      .catch(() => {
        toast.error("error while refusing friend request");
      });
  };

  const handleAcceptRequest = (
    e: MouseEvent<HTMLButtonElement>,
    id: string
  ) => {
    e.preventDefault();
    api
      .post("/user/accept-friend-request", { id: id })
      .then(() => {
        toast.success("friend request accepted");
        props.setReloadPlayer(true);
      })
      .catch(() => {
        toast.error("Error while accepting friend request");
      });
  };

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
            <AddIcon
              alt="accept-friend-request"
              onClick={(e: MouseEvent<HTMLButtonElement>) =>
                handleAcceptRequest(e, request.id)
              }
            />
            <RemoveIcon
              alt="refuse-friend-request"
              onClick={(e: MouseEvent<HTMLButtonElement>) =>
                handleRefuseRequest(e, request.id)
              }
            />
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
      {props.isPerso && props.player?.friend_requests.length ? (
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
