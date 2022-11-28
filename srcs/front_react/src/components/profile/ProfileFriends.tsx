import userEvent from "@testing-library/user-event";
import React, { Fragment, MouseEvent, useContext } from "react";
import { AuthContext, AuthContextType, User } from "../../contexts/AuthContext";
import { ReactComponent as AddIcon } from "../../assets/img/icon/check.svg";
import { ReactComponent as RemoveIcon } from "../../assets/img/icon/remove.svg";
import { Link } from "react-router-dom";
import { api } from "../../const/const";
import { toast } from "react-toastify";

interface IProps {
  player: User | null;
  isPerso: boolean;
  setReloadPlayer: (reload: boolean) => void;
}

function ProfileFriends(props: IProps) {
  let allFriendRequests: JSX.Element[] | undefined;
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
        props.setReloadPlayer(true);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error while accepting friend request");
      });
  };

  if (props.isPerso) {
    allFriendRequests = props.player?.friend_requests.map(
      (request: User, index: number) => {
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
              <button className="friend__request_button">
                <AddIcon
                  alt="accept-friend-request"
                  onClick={(e: MouseEvent<HTMLButtonElement>) =>
                    handleAcceptRequest(e, request.id)
                  }
                />
              </button>
              <button className="friend__request_button">
                <RemoveIcon
                  alt="refuse-friend-request"
                  onClick={(e: MouseEvent<HTMLButtonElement>) =>
                    handleRefuseRequest(e, request.id)
                  }
                />
              </button>
            </div>
            <hr />
          </Fragment>
        );
      }
    );
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
