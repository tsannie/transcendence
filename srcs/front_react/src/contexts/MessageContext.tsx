import React, {
  createContext,
  EffectCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";
import { io, Socket } from "socket.io-client";
import { IChannel, IDm, IMessageReceived } from "../components/chat/types";
import { AuthContext, AuthContextType } from "./AuthContext";
import { ChatDisplayContext } from "./ChatDisplayContext";

export const MessageContext = createContext<MessageContextInterface>(
  {} as MessageContextInterface
);

export interface MessageContextInterface {
  socket: Socket | null;
  newMessage: IMessageReceived | null;
  chatList: (IChannel | IDm)[];
  setChatList: React.Dispatch<React.SetStateAction<(IChannel | IDm)[]>>;
}

interface MessageProviderProps {
  children: JSX.Element | JSX.Element[];
}

export const MessageProvider = ({ children }: MessageProviderProps) => {
  const [newMessage, setNewMessage] = useState<IMessageReceived | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [chatList, setChatList] = useState<(IChannel | IDm)[]>([]);
  const { inviteList, setInvite } = useContext(ChatDisplayContext);

  useEffect(() => {
    const newSocket: any = io("http://localhost:4000/chat", {
      transports: ["websocket"],
    });
    setSocket(newSocket);
    return () => newSocket.disconnect(); // disconnect old socket
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("error", (error) => {
        toast.error("Error:" + error);
      });
      socket.on("message", (data) => {
        setNewMessage(data);
      });
      /* socket.on("newChannel", (data) => {
        console.log("newChannel === ", data);
      }); */
      socket.on("inviteChannel", (channel) => {
        console.log("inviteChannel === ", channel);
        setInvite([channel, ...inviteList]);
      });
      return () => {
        socket.off("message");
        socket.off("error");
        socket.off("inviteChannel");
      };
    }
  }, [socket]);

  return (
    <MessageContext.Provider value={{ socket, newMessage, chatList, setChatList }}>
      {children}
    </MessageContext.Provider>
  );
};
