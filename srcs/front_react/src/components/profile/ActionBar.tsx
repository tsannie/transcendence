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
} from "../../contexts/ChatDisplayContext";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

interface IProps {
  player: User | null;
  setReloadPlayer: (reload: boolean) => void;
}

function ActionBar(props: IProps) {
  const { user } = useContext(AuthContext) as AuthContextType;
  const { setRedirection, setTargetRedirection } = useContext(
    ChatDisplayContext
  ) as ChatDisplayContextInterface;
  const nav = useNavigate();

  const handleRemoveFriend = () => {
    api.post("/user/remove-friend", { id: props.player?.id + "" }).then(
      () => {
        props.setReloadPlayer(true);
        toast.success("friend removed !");
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
        .post("/user/accept-friend-request", { id: props.player?.id + "" })
        .then(() => {
          toast.success("you are now friend with " + props.player?.username);
          props.setReloadPlayer(true);
        })
        .catch(() => {
          toast.error("error while accepting friend request");
        });
    } else {
      api
        .post("/user/create-friend-request", { id: props.player?.id + "" })
        .then(() => {
          toast.info("friend request sent !");
        })
        .catch((err: AxiosError) => {
          if (err.response?.status === 422)
            toast.error("you already sent a friend request");
          else toast.error("error while sending friend request");
        });
    }
  };

  const handleDm = () => {
    nav("/chat");
    setRedirection(true);
    setTargetRedirection(props.player?.id as string);
  };

  return (
    <div className="action-bar">
      <div className="action-bar__item">
        <ChatIcon alt="chat" onClick={handleDm} />
        <span>chat</span>
      </div>
      {props.player?.friends.find((friend) => friend.id === user?.id) ? (
        <div className="action-bar__item">
          {/* TODO EDIT ICON */}
          <RemoveFriendIcon alt="remove-friend" onClick={handleRemoveFriend} />
          <span>remove friend</span>
        </div>
      ) : (
        <div className="action-bar__item">
          {/* TODO EDIT ICON */}
          <AddFriendIcon alt="add-friend" onClick={handleAddFriend} />
          <span>add friend</span>
        </div>
      )}
      <div className="action-bar__item">
        <BlockIcon alt="block" />
        <span>block</span>
      </div>
    </div>
  );
}

export default ActionBar;
