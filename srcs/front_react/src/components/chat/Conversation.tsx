import { Fragment, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../../const/const";
import { ChatDisplayContext, ChatDisplayContextInterface, ChatType } from "../../contexts/ChatDisplayContext";
import { MessageContext } from "../../contexts/MessageContext";
import MessageBody from "./MessageBody";
import Options from "./Options";
import { IChannel, IDm } from "./types";

export interface IDatas{
  status: string,
  data: IChannel,
}

function Conversation() {
  const { setDisplay, currentConv, setCurrentConv, isChannel, targetRedirection, setRedirection } : ChatDisplayContextInterface = useContext(ChatDisplayContext);
  const { chatList } = useContext(MessageContext);
  const [dm, setDm] = useState<IDatas | IDm | null >(null);

  const loadContent = async () => {
    let route: string = isChannel? "channel/datas" : "dm/datas";
    
    if (!currentConv)
      return ;
    await api
      .get(route, {params: {id: currentConv}})
      .then((res) => {
        setDm(res.data);
      })
      .catch((err) => {
          toast.error("HTTP error: " + err);
      })
  }

  const searchExistingConv = async () => {
    await api
      .get("/dm/target", {params: {targetId: targetRedirection}})
      .then((res) => {
        if (!res.data) 
          return;
        setRedirection(false);
        setCurrentConv(res.data.id);
      })
  }

  useEffect( () => {
    console.log(currentConv);
    console.log(chatList);
    if (!currentConv) {
      console.log("zici");
      if (!chatList || chatList.length == 0) { 
        console.log("la");
        setDisplay(ChatType.JOINFORM);
        return ;
      }
      else
        setCurrentConv(chatList[0].id);
    } ;
    const async_fct = async () => {
      await loadContent(); 
    }
    async_fct();
  }, [currentConv, chatList])

  useEffect( () => {
    if (!targetRedirection) return ;
    const async_fct = async () => {
      await searchExistingConv();
    }
    async_fct();
  }, [targetRedirection])

    return (
      <Fragment>
        <MessageBody currentConvId={currentConv} isChannel={isChannel} data={dm}/>
        <Options currentConvId={currentConv} isChannel={isChannel} data={dm} targetRedirection={targetRedirection}/>
      </Fragment>);
  }

  export default Conversation;