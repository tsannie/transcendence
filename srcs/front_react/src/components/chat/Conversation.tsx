import { Fragment, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../../const/const";
import {
  ChatDisplayContext,
  ChatDisplayContextInterface,
  ChatType,
} from "../../contexts/ChatDisplayContext";
import { ChatNotifContext } from "../../contexts/ChatNotificationContext";
import MessageBody from "./MessageBody";
import Options from "./Options";
import { IChannel, IDm } from "./types";

export interface IDatas {
  status: string;
  data: IChannel;
}

function Conversation() {
  const {
    setDisplay,
    currentConv,
    setCurrentConv,
    isChannel,
    targetRedirection,
    isRedirection,
    setRedirection,
  }: ChatDisplayContextInterface = useContext(ChatDisplayContext);
  const [dm, setDm] = useState<IDatas | IDm | null>(null);
  const { removeChannel } = useContext(ChatNotifContext);

  const loadContent = () => {
    if (!currentConv) return;
    let route: string = isChannel ? "channel/datas" : "dm/datas";

    api
      .get(route, { params: { id: currentConv } })
      .then((res) => {
        setDm(res.data);
      })
      .catch((err) => {
        toast.error("HTTP error: " + err.response.data.message);
      });
  };

  const searchExistingConv = () => {
    api
      .get("/dm/target", { params: { targetId: targetRedirection } })
      .then((res) => {
        if (!res.data) return;
        setRedirection(false);
        setCurrentConv(res.data.id);
      });
  };

  useEffect(() => {
    if (!currentConv && !isRedirection) {
      setDisplay(ChatType.CREATEFORM);
      return;
    }
    removeChannel(currentConv);
    loadContent();
  }, [currentConv, isRedirection]);

  useEffect(() => {
    if (!targetRedirection) return;

    searchExistingConv();
  }, [targetRedirection]);

  return (
    <Fragment>
      <MessageBody
        currentConvId={currentConv}
        isChannel={isChannel}
        data={dm}
      />
      <Options
        currentConvId={currentConv}
        isChannel={isChannel}
        data={dm}
        targetRedirection={targetRedirection}
      />
    </Fragment>
  );
}

export default Conversation;
