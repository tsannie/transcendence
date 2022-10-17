import React, { useContext, useEffect, useRef, useState } from "react";
import { createContext } from "react";
import { IMessage } from "../components/chat/types";
import { api } from "../const/const";
import { SocketContext } from "./SocketContext";
import { UserContext } from "./UserContext";

export type MessagesContextType = {
  messagesList: IMessage[];
  setMessagesList: (messagesList: IMessage[]) => void;
  loadMessages: (targetId: number, isDm: boolean) => void;
  isDm: boolean;
  setIsDm: (isDm: boolean) => void;
  convId: number;
  setConvId: (convId: number) => void;
  isNewMessage: boolean;
  setIsNewMessage: (isNewMessage: boolean) => void;
  displayConv: boolean;
  setDisplayConv: (displayConv: boolean) => void;
};

export const MessagesContext = createContext<MessagesContextType>({
  messagesList: [],
  setMessagesList: () => {},
  loadMessages: () => {},
  isDm: true,
  setIsDm: () => {},
  convId: 0,
  setConvId: () => {},
  isNewMessage: false,
  setIsNewMessage: () => {},
  displayConv: false,
  setDisplayConv: () => {},
});

interface MessagesContextProps {
  children: JSX.Element | JSX.Element[];
}

export const MessagesProvider = ({ children }: MessagesContextProps) => {
  const [messagesList, setMessagesList] = useState<IMessage[]>([]);
  //const [currentMessage, setCurrentMessage] = useState("");
  const [isNewMessage, setIsNewMessage] = useState(false);
  const [displayConv, setDisplayConv] = useState(false);
  const [isDm, setIsDm] = useState(true);
  const [convId, setConvId] = useState(0);
  const socket = useContext(SocketContext);
  const { userConnected } = useContext(UserContext);

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
      //console.log("message received from server !!!!!!");
      setMessagesList((messagesList) => [data, ...messagesList]);
    });
  }, []);

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
        displayConv,
        setDisplayConv,
        isNewMessage,
        setIsNewMessage,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
};
