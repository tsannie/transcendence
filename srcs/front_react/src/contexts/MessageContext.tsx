import React, { createContext, EffectCallback, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { IMessageReceived } from "../components/chat/types";
import { AuthContext, AuthContextType } from "./AuthContext";

export const MessageContext = createContext<MessageContextInterface>({} as MessageContextInterface);

export interface MessageContextInterface {
  socket: Socket | null;
  newMessage: IMessageReceived | null;
}

interface MessageProviderProps {
  children: JSX.Element | JSX.Element[];
}

export const MessageProvider = ({ children }: MessageProviderProps) => {
  const { user } = useContext(AuthContext) as AuthContextType;
  const [ newMessage, setNewMessage ] = useState<IMessageReceived | null>(null);
  const [ socket, setSocket ] = useState<Socket | null>(null);

  useEffect((): ReturnType<EffectCallback> => {
    if (user) {
      const newSocket: any = io("http://localhost:4000/chat", {
        transports: ["websocket"],
      });
      setSocket(newSocket);
      return () => newSocket.disconnect(); // disconnect old socket
    }
  }, [user]); // create a new socket when user changes only

  useEffect(() => {
    if (socket)
    {
      socket.on("connect", () => console.log("connected to socket"));
      socket.on("disconnect", () => console.log("disconnected from socket"));
      /* socket.on("message", (data) => {
          setNewMessage(data);
      }) */

      return (() => {
        socket.off("connect");
        socket.off("disconnect");
        //socket.off("message");
      })
    };
  }, []);

  useEffect(() => {
    if (socket)
    {
      socket.on("message", (data) => {
        setNewMessage(data);
      })
      return (() => {
        socket.off("message");
      })
    };
  }, [socket]);

  return (
    <MessageContext.Provider value={{socket, newMessage}}>{children}</MessageContext.Provider>
  );
};
