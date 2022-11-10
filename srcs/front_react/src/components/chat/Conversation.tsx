import { Fragment, useContext, useEffect, useState } from "react";
import { api } from "../../const/const";
import { ChatDisplayContext } from "../../contexts/ChatDisplayContext";
import MessageBody from "./Channel";
import Options from "./Options";
import { IChannel, IDm } from "./types";

function Conversation() {
  const { currentConv, isChannel, targetRedirection } = useContext(ChatDisplayContext);
  const [dm, setDm] = useState<IDm | IChannel>({} as IDm | IChannel);

  // const loadTarget = async () => {
  //   await api
  //     .get("dm/")
  // }

  // const loadContent = async() => {
  //   let route: string = isChannel? "channel/datas" : "dm/datas";
  //   let id;

  //   if (targetRedirection.length != 0)
  //     loadTarget()
  // }

  // useEffect(() => {
  //   const async_fct = async () => {
  //     await loadContent();
  //   }
  //   async_fct;
  // }, [currentConv, targetRedirection])

    return (
      <Fragment>
        <MessageBody currentConvId={currentConv} isChannel={isChannel}/>
        <Options currentConvId={currentConv} isChannel={isChannel} data={dm}/>
      </Fragment>);
  }

  export default Conversation;