import { AxiosResponse } from "axios";
import { useContext } from "react";
import { toast } from "react-toastify";
import { ReactComponent as AcceptIcon } from "../../assets/img/icon/check.svg";
import { ReactComponent as RefuseIcon } from "../../assets/img/icon/remove.svg";
import { api } from "../../const/const";
import {
  ChatDisplayContext,
  ChatType,
} from "../../contexts/ChatDisplayContext";
import { MessageContext } from "../../contexts/MessageContext";
import { IChannel } from "./types";

function InviteList() {
  const {
    setDisplay,
    setCurrentConv,
    setIsChannel,
    setNewConv,
    setMuted,
    setMuteDate,
  } = useContext(ChatDisplayContext);
  const { inviteList, setInvite } = useContext(MessageContext);

  const acceptInvite = (channel: IChannel) => {
    api
      .post("/channel/join", { id: channel.id })
      .then((res: AxiosResponse) => {
        setInvite(inviteList.filter((elem) => elem.id !== channel.id));
        setDisplay(ChatType.CONV);
        setCurrentConv(res.data.id);
        setIsChannel(true);
        setNewConv(res.data);
        setMuted(false);
        setMuteDate(null);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const declineInvite = (channel: IChannel) => {
    setInvite(inviteList.filter((elem) => elem.id !== channel.id));
  };

  const displayInvitations = inviteList.map((elem) => {
    let username: string = "";
    if (elem.owner) username = elem.owner.username;
    return (
      <li key={elem.id}>
        <div className="invite_info">
          <div className="invite_title" title={elem.name}>
            {elem.name}
          </div>
          <span title={`by: ${username}`}>by: {username}</span>
        </div>
        <div className="invite_buttons">
          <button onClick={() => acceptInvite(elem)}>
            <AcceptIcon />
          </button>
          <button onClick={() => declineInvite(elem)}>
            <RefuseIcon />
          </button>
        </div>
      </li>
    );
  });

  if (!inviteList) return null;
  else return <div className="invitations">{displayInvitations}</div>;
}

export default InviteList;
