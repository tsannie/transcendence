import React, { useContext } from "react";
import { ReactComponent as ChatIcon } from "../../assets/img/icon/chat.svg";
import { ReactComponent as AddFriendIcon } from "../../assets/img/icon/add-friend.svg";
import { ReactComponent as RemoveFriendIcon } from "../../assets/img/icon/remove-friend.svg";
import { ReactComponent as BlockIcon } from "../../assets/img/icon/no_waiting_sign.svg";
import { AuthContext, AuthContextType, User } from "../../contexts/AuthContext";
import { api } from "../../const/const";
import { toast } from "react-toastify";
import {
  ChatDisplayContext,
  ChatDisplayContextInterface,
  ChatType,
} from "../../contexts/ChatDisplayContext";
import { useNavigate } from "react-router-dom";
import { AxiosError, AxiosResponse } from "axios";

interface IProps {
  player: User | null;
  setReloadPlayer: (reload: boolean) => void;
}

function ActionBar(props: IProps) {
  const { user } = useContext(AuthContext) as AuthContextType;
  const { setIsChannel, setDisplay, setRedirection, setTargetRedirection } =
    useContext(ChatDisplayContext) as ChatDisplayContextInterface;
  const nav = useNavigate();

  const handleRemoveFriend = () => {
    api.post("/user/remove-friend", { id: props.player?.id }).then(
      () => {
        props.setReloadPlayer(true);
      },
      () => {
        toast.error("error while removing friend");
      }
    );
  };

  const handleAddFriend = () => {
    if (
      user?.friend_requests.find((req_user) => req_user.id === props.player?.id)
    ) {
      api
        .post("/user/accept-friend-request", { id: props.player?.id })
        .then(() => {
          props.setReloadPlayer(true);
        })
        .catch(() => {
          toast.error("error while accepting friend request");
        });
    } else {
      api
        .post("/user/create-friend-request", { id: props.player?.id })
        .then(() => {
          props.setReloadPlayer(true);
          toast.info("friend request sent !");
        })
        .catch(() => {
          toast.error("Friend request already sent");
        });
    }
  };

  const handleDm = () => {
    setRedirection(true);
    setDisplay(ChatType.CONV);
    setIsChannel(false);
    setTargetRedirection(props.player?.id as string);
    nav("/chat");
  };

  return (
    <div className="action-bar">
      <div className="action-bar__item">
        <button onClick={handleDm}>
          <ChatIcon alt="chat" />
        </button>
        <span>chat</span>
      </div>
      {props.player?.friends.find((friend) => friend.id === user?.id) ? (
        <div className="action-bar__item">
          <button onClick={handleRemoveFriend}>
            <RemoveFriendIcon alt="remove-friend" />
          </button>
          <span>remove friend</span>
        </div>
      ) : (
        <div className="action-bar__item">
          <button onClick={handleAddFriend}>
            <AddFriendIcon alt="add-friend" />
          </button>
          <span>add friend</span>
        </div>
      )}
      <div className="action-bar__item">
        <button>
          <BlockIcon alt="block" />
        </button>
        <span>block</span>
      </div>
    </div>
  );
}

export default ActionBar;
