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
  setTargetUsername: (targetUsername: string) => void;
};

export const MessagesContext = createContext<MessagesContextType>({
  messagesList: [],
  setMessagesList: () => {},
  currentMessage: "",
  setCurrentMessage: () => {},
  sendMessage: () => {},
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
      const messageData: IMessage = {
        author: user.username,
        content: currentMessage,
        target: targetUsername,
      };
      console.log(messageData);
      socket.emit("message", messageData);
      //messages.setMessagesList((list) => [...list, messageData]);
      let newMessagesList = [...messagesList, messageData];

      setMessagesList(newMessagesList);
      setCurrentMessage("");
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
        setTargetUsername,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
};
