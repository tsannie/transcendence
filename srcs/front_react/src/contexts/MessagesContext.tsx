import React, { useContext, useEffect, useState } from "react";
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
  sendMessage: () => void;
  targetUsername: string;
  setTargetUsername: (targetUsername: string) => void;
};

export const MessagesContext = createContext<MessagesContextType>({
  messagesList: [],
  setMessagesList: () => {},
  currentMessage: "",
  setCurrentMessage: () => {},
  sendMessage: () => {},
  targetUsername: "",
  setTargetUsername: () => {},

});

interface MessagesContextProps {
  children: JSX.Element | JSX.Element[];
}

export const MessagesProvider = ({ children }: MessagesContextProps) => {
  const [messagesList, setMessagesList] = useState<IMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [targetUsername, setTargetUsername] = useState("");
  const socket = useContext(SocketContext);
  const user = useContext(UserContext);

  function sendMessage() {
    console.log("send message");
    const inputMessage = document.getElementById(
      "input-message"
    ) as HTMLInputElement;

    inputMessage.value = "";
    if (currentMessage !== "") {
      const messageData: Partial<IMessage> = {
        author: user.username,
        content: currentMessage,
        target: targetUsername,
      };
      console.log(messageData);
      socket.emit("message", messageData);
      /* let newMessagesList = [...messagesList, messageData];

      setMessagesList(newMessagesList); */ // msg list s'actualise que dans le on
      setCurrentMessage("");
    }
  }

  async function loadMessages(id: number, isDm: boolean) {
    console.log("load messages");
    if (isDm) {
      await api
        .get("dm/getById", {
          params: {
            id: id,
          },
      })
      .then((res) => {
        setMessagesList(res.data);
      })
      .catch((res) => {
        console.log("invalid messages");
        console.log(res);
      });
    }
    else {
      await api.get("channel/getById", {
        params: {
          id: id,
        },
      })
      .then((res) => {
        setMessagesList(res.data);
      })
      .catch((res) => {
        console.log("invalid messages");
        console.log(res);
      });
    }
  }

  return (
    <MessagesContext.Provider
      value={{
        messagesList,
        setMessagesList,
        currentMessage,
        setCurrentMessage,
        sendMessage,
        targetUsername,
        setTargetUsername,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
};
