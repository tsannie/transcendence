import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { IMessageReceived } from "../components/chat/types";
import { AuthContext, AuthContextType } from "./AuthContext";

export const MessageContext = createContext<MessageContextInterface>({} as MessageContextInterface);

export interface MessageContextInterface {
  newMessage: IMessageReceived | null;
  changeNewMessage: (newMessage: IMessageReceived | null) => void;
} 

interface MessageProviderProps {
  children: JSX.Element | JSX.Element[];
}

export const MessageProvider = ({ children }: MessageProviderProps) => {
  const { user } = useContext(AuthContext) as AuthContextType;
  const [ newMessage, setNewMessage ] = useState<IMessageReceived | null>(null);

  const changeNewMessage = (newMessage: IMessageReceived | null) => {
    setNewMessage(newMessage);
  }

  const socket = io("http://localhost:4000/chat", {
    query: {
      userId: user?.id,
    },
  });

  useEffect(() => {
    if (socket)
    {
      socket.on("connect", () => console.log("connected to socket"));
      socket.on("disconnect", () => console.log("disconnected from socket"));
      socket.on("message", (data) => {
          setNewMessage(data);
    })
    };

    return ( () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("message");
    })
  }, []);

  return (
    <MessageContext.Provider value={{newMessage, changeNewMessage}}>{children}</MessageContext.Provider>
  );
};
