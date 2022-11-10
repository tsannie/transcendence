import { Fragment, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../../const/const";
import { ChatDisplayContext } from "../../contexts/ChatDisplayContext";
import MessageBody from "./Channel";
import Options from "./Options";
import { IChannel, IDm } from "./types";

function Conversation() {
  const { currentConv, setCurrentConv, isChannel, targetRedirection, setRedirection } = useContext(ChatDisplayContext);
  const [dm, setDm] = useState<IDm | IChannel>({} as IDm | IChannel);

  const loadContent = async() => {
    let route: string = isChannel? "channel/datas" : "dm/datas";
    
    if (!currentConv)
      return ;
    api
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
        if (!res.data) return;
        setRedirection(false);
        setCurrentConv(res.data);
      })
  }

  useEffect( () => {
    if (!currentConv) return ;
    const async_fct = async () => {
      await loadContent(); 
    }
    async_fct();
  }, [currentConv])

  useEffect( () => {
    if (!targetRedirection) return ;
    const async_fct = async () => {
      await searchExistingConv();
    }
    async_fct();
  }, [targetRedirection])

    return (
      <Fragment>
        <MessageBody currentConvId={currentConv} isChannel={isChannel}/>
        <Options currentConvId={currentConv} isChannel={isChannel} data={dm}/>
      </Fragment>);
  }

  export default Conversation;