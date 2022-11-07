import React, { useContext } from "react";
import { ReactComponent as ChatIcon } from "../../assets/img/icon/chat.svg";
import { ReactComponent as UserIcon } from "../../assets/img/icon/user.svg";
import { ReactComponent as BlockIcon } from "../../assets/img/icon/no_waiting_sign.svg";
import { AuthContext, AuthContextType, User } from "../../contexts/AuthContext";
import { api } from "../../const/const";
import { toast } from "react-toastify";

interface IProps {
  player: User | null;
}

function ActionBar(props: IProps) {
  const { user, setReloadUser } = useContext(AuthContext) as AuthContextType;

  const handleRemoveFriend = () => {
    api.post("/user/remove-friend", { id: props.player?.id }).then(
      (res) => {
        setReloadUser(true);
        toast.success("friend removed !");
      },
      (err) => {
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
        .then((res) => {
          toast.success("you are now friend with " + props.player?.username);
          setReloadUser(true);
        })
        .catch((err) => {
          toast.error("error while accepting friend request");
        });
    } else {
      api
        .post("/user/create-friend-request", { id: props.player?.id })
        .then((res) => {
          toast.info("friend request sent !");
        })
        .catch((err) => {
          toast.error("error while sending friend request");
        });
    }
  };

  return (
    <div className="action-bar">
      <div className="action-bar__item">
        <ChatIcon alt="chat" />
        <span>chat</span>
      </div>
      {user?.friends.find((friend) => friend.id === props.player?.id) ? (
        <div className="action-bar__item">
          {/* TODO EDIT ICON */}
          <BlockIcon alt="remove-friend" onClick={handleRemoveFriend} />
          <span>remove friend</span>
        </div>
      ) : (
        <div className="action-bar__item">
          {/* TODO EDIT ICON */}
          <UserIcon alt="add-friend" onClick={handleAddFriend} />
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
