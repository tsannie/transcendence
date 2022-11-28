import { AxiosError, AxiosResponse } from "axios";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { api } from "../../../const/const";
import { User } from "../../../contexts/AuthContext";
import { ReactComponent as BallIcon } from "../../../assets/img/icon/ball-reverse.svg";
import { GameContext, GameContextType } from "../../../contexts/GameContext";
import { Link } from "react-router-dom";
import { GameMode, IInvitation } from "../const/const";
import { ICreateRoom } from "../types";
import { toast } from "react-toastify";

function GameAmical() {
  const { socket, friendsLog, inviteReceived } = useContext(
    GameContext
  ) as GameContextType;

  let allFriends: JSX.Element[] = [];
  let allInvitations: JSX.Element[] = [];

  const handleInvite = (friend_id: string, mode: GameMode) => {
    if (socket) {
      const data: ICreateRoom = {
        mode: mode,
        invitation_user_id: friend_id,
      };
      socket.emit("createPrivateRoom", data);
    }
  };

  if (friendsLog.length) {
    allInvitations = inviteReceived.map(
      (invite: IInvitation, index: number) => {
        const friend = friendsLog.find((f) => f.id === invite.user_id);
        if (friend) {
          return (
            <div className="duel__list__item" key={friend.id}>
              <div className="duel__list__item__info">
                <Link to={`/profile/${friend.username}`}>
                  <button>
                    <img src={friend.profile_picture} alt="avatar" />
                  </button>
                </Link>
                <span
                  title={friend.username.length > 10 ? friend.username : ""}
                >
                  {friend.username.length > 10
                    ? friend.username.slice(0, 7) + "..."
                    : friend.username}
                </span>
              </div>
              <div className="duel__list__item__action">
                <button
                  id={invite.mode === GameMode.CLASSIC ? "classic" : "trans"}
                  title="Accept"
                  //onClick={() => handleAccept(friend.id)}
                >
                  <BallIcon />
                </button>
                <button
                  id={invite.mode === GameMode.CLASSIC ? "classic" : "trans"}
                  title="Decline"
                  //onClick={() => handleDecline(friend.id)}
                >
                  <BallIcon />
                </button>
              </div>
            </div>
          );
        } else {
          return <Fragment key={index}></Fragment>;
        }
      }
    );

    friendsLog.sort((a, b) => {
      if (a.username < b.username) return -1;
      if (a.username > b.username) return 1;
      return 0;
    });
    allFriends = friendsLog.map((friend: User, index: number) => {
      // check if user is already in the list of invitations
      if (inviteReceived.some((inv) => inv.user_id === friend.id))
        return <Fragment key={index}></Fragment>;
      return (
        <div className="duel__list__item" key={friend.id}>
          <div className="duel__list__item__info">
            <Link to={`/profile/${friend.username}`}>
              <button>
                <img src={friend.profile_picture} alt="avatar" />
              </button>
            </Link>
            <span title={friend.username.length > 10 ? friend.username : ""}>
              {friend.username.length > 10
                ? friend.username.slice(0, 7) + "..."
                : friend.username}
            </span>
          </div>
          <div className="duel__list__item__action">
            <button
              id="classic"
              title="Invite in classic mode"
              onClick={() => handleInvite(friend.id, GameMode.CLASSIC)}
            >
              <BallIcon />
            </button>
            <button
              id="trans"
              title="Invite in trans mode"
              onClick={() => handleInvite(friend.id, GameMode.TRANS)}
            >
              <BallIcon />
            </button>
          </div>
        </div>
      );
    });
  } else {
    allFriends = [
      <div className="no-room" key="no-room">
        <span>no friends connected</span>
      </div>,
    ];
  }

  return (
    <div className="amical">
      <div className="game__menu__item__header">
        <h2>amical</h2>
      </div>
      <div className="duel__list">
        {allInvitations}
        {allFriends}
      </div>
    </div>
  );
}

export default GameAmical;
