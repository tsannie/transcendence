import React, { useContext, useEffect, useRef, useState } from "react";
import { createContext } from "react";
import { IMessage } from "../components/chat/types";
import { api } from "../const/const";
import { SocketContext } from "./SocketContext";
import { UserContext } from "./UserContext";

export type MessagesContextType = {
  messagesList: IMessage[];
  setMessagesList: (messagesList: IMessage[]) => void;
  currentMessage: string;
  setCurrentMessage: (currentMessage: string) => void;
  sendMessage: (id: number) => void;
  loadMessages: (targetId: number, isDm: boolean) => void;
  isDm: boolean;
  setIsDm: (isDm: boolean) => void;
  convId: number;
  setConvId: (convId: number) => void;
};

export const MessagesContext = createContext<MessagesContextType>({
  messagesList: [],
  setMessagesList: () => {},
  currentMessage: "",
  setCurrentMessage: () => {},
  sendMessage: () => {},
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
  const [messagesList, setMessagesList] = useState<IMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isDm, setIsDm] = useState(true);
  const [convId, setConvId] = useState(0);
  const socket = useContext(SocketContext);
  const { userConnected } = useContext(UserContext);

  function sendMessage(id: number) {
    console.log("send message");
    const inputMessage = document.getElementById(
      "input-message"
    ) as HTMLInputElement;

    inputMessage.value = "";
    if (currentMessage !== "") {
      const messageData: Partial<IMessage> = {
        id: id,
        author: userConnected,
        content: currentMessage,
        isDm: isDm,
      };
      socket.emit("message", messageData);
      setCurrentMessage("");
    }
  }

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
  }, [socket]);

  return (
    <MessagesContext.Provider
      value={{
        messagesList,
        setMessagesList,
        currentMessage,
        setCurrentMessage,
        sendMessage,
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
