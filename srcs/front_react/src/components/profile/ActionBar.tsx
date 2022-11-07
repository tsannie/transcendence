import React, { useContext } from "react";
import { ReactComponent as ChatIcon } from "../../assets/img/icon/chat.svg";
import { ReactComponent as UserIcon } from "../../assets/img/icon/user.svg";
import { ReactComponent as BlockIcon } from "../../assets/img/icon/no_waiting_sign.svg";
import { User } from "../../contexts/AuthContext";
import { api } from "../../const/const";
import { toast } from "react-toastify";

interface IProps {
  player: User | null;
}

function ActionBar(props: IProps) {
  const handleAddFriend = () => {
    api
      .post("/user/create-friend-request", { id: props.player?.id })
      .then((res) => {
        toast.info("friend request sent !");
        console.log(res);
      });
  };

  return (
    <div className="action-bar">
      <div className="action-bar__item">
        <ChatIcon alt="chat" />
        <span>chat</span>
      </div>
      <div className="action-bar__item">
        <UserIcon alt="add-friend" onClick={handleAddFriend} />
        <span>add friend</span>
      </div>
      <div className="action-bar__item">
        <BlockIcon alt="block" />
        <span>block</span>
      </div>
    </div>
  );
}

export default ActionBar;
