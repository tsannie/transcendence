import React, { useContext, useEffect, useRef, useState } from "react";
import { createContext } from "react";
import { IMessage, IMessageReceived } from "../components/chat/types";
import { api } from "../const/const";
import { SocketContext } from "./SocketContext";
import { UserContext } from "./UserContext";

export type MessagesContextType = {
  messagesList: IMessageReceived[];
  setMessagesList: (messagesList: any[]) => void;
  loadMessages: (targetId: number, isDm: boolean) => void;
  isDm: boolean;
  setIsDm: (isDm: boolean) => void;
  convId: number;
  setConvId: (convId: number) => void;
};

export const MessagesContext = createContext<MessagesContextType>({
  messagesList: [],
  setMessagesList: () => {},
  loadMessages: () => {},
  isDm: true,
  setIsDm: () => {},
  convId: 0,
  setConvId: () => {},
});

interface MessagesContextProps {
  children: JSX.Element | JSX.Element[];
}

export const MessagesProvider = ({ children }: MessagesContextProps) => {
  const [messagesList, setMessagesList] = useState<any[]>([]);
  const [isDm, setIsDm] = useState(true);
  const [convId, setConvId] = useState(0);
  const socket = useContext(SocketContext);

  async function loadMessages(id: number, isDm: boolean) {
    if (isDm === true) {
      await api
        .get("message/dm", {
          params: {
            id: id, // id du dm
            offset: 0,
          },
        })
        .then((res) => {
          //console.log("msg data = ", res.data);
          setMessagesList(res.data);
        })
        .catch((res) => {
          console.log("invalid messages");
          console.log(res);
        });
    } else {
      await api
        .get("message/channel", {
          params: {
            id: id, // id du channel
            offset: 0,
          },
        })
        .then((res) => {
          console.log("channel data = ", res.data);
          setMessagesList(res.data);
        })
        .catch((res) => {
          console.log("invalid messages");
          console.log(res);
        });
    }
  }

  useEffect(() => {
    socket.on("message", (data) => {
      //console.log("message received with data = ", data);
      let id;

      if (data.dm)
        id = data.dm.id;
      else
        id = data.channel.id;

      //console.log("id = ", id);
      //console.log("convId = ", convId);
      const newMsg: IMessageReceived = {
        author: data.author,
        id: id,
        uuid: data.uuid,
        content: data.content,
        createdAt: data.createdAt,
      };

      // marche pas car convid est pas encore set quand le message arrive
      // TODO: regler le bug que quand je reload le front ici, ca ne recharge pas les messages de l'ancienne conv
      //console.log("convId = ", convId);
      //if (id === convId) {
        setMessagesList((messagesList) => [newMsg, ...messagesList]);
      //}
    });
  }, [socket]);

  return (
    <MessagesContext.Provider
      value={{
        messagesList,
        setMessagesList,
        loadMessages,
        isDm,
        setIsDm,
        convId,
        setConvId,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
};
