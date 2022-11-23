import React, {
  createContext,
  EffectCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";
import { io, Socket } from "socket.io-client";
import { IMessageReceived } from "../components/chat/types";
import { AuthContext, AuthContextType } from "./AuthContext";

export const MessageContext = createContext<MessageContextInterface>(
  {} as MessageContextInterface
);

export interface MessageContextInterface {
  socket: Socket | null;
  newMessage: IMessageReceived | null;
}

interface MessageProviderProps {
  children: JSX.Element | JSX.Element[];
}

export const MessageProvider = ({ children }: MessageProviderProps) => {
  const [newMessage, setNewMessage] = useState<IMessageReceived | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    console.log("socket created");
    const newSocket: any = io("http://localhost:4000/chat", {
      transports: ["websocket"],
    });
    setSocket(newSocket);
    return () => newSocket.disconnect(); // disconnect old socket
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("error", (error) => {
        console.log("ERROR");
        toast.error("Error:" + error);
      });
      socket.on("message", (data) => {
        setNewMessage(data);
      });
      socket.on("newChannel", (data) => {
        console.log("newChannel === ", data);
      });
      return () => {
        socket.off("message");
        socket.off("error");
      };
    }
  }, [socket]);

  return (
    <MessageContext.Provider value={{ socket, newMessage }}>
      {children}
    </MessageContext.Provider>
  );
};
