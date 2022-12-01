import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";
import { io, Socket } from "socket.io-client";
import { IChannel, IDm, IMessageReceived } from "../components/chat/types";
import { AuthContext } from "./AuthContext";
import { ChatDisplayContext } from "./ChatDisplayContext";
import { ChatNotifContext } from "./ChatNotificationContext";
import { TransitionContext } from "./TransitionContext";

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
  const [ newMessage, setNewMessage ] = useState<IMessageReceived | null>(null);
  const [ socket, setSocket ] = useState<Socket | null>(null);
  const [ chatList, setChatList ] = useState<(IChannel | IDm)[]>([]);
  const { currentConv, inviteList, setInvite } = useContext(ChatDisplayContext);
  const { channels, addChannel } = useContext(ChatNotifContext);

  const { user } = useContext(AuthContext);


  useEffect(() => {
    const newSocket: any = io("http://localhost:4000/chat", {
      transports: ["websocket"],
    });
    setSocket(newSocket);
    return () => newSocket.disconnect(); // disconnect old socket
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("message", (data) => {
        if (data.author.id !== user?.id)
        {
          if (data.channel && data.channel.id != currentConv)
            addChannel(data.channel.id);
          if (data.dm && data.dm.id != currentConv)
            addChannel(data.dm.id);
        }
        setNewMessage(data);
      });
      socket.on("exception", (response) => {
        toast.error("exception:" + response.message);
      });
      /* socket.on("newChannel", (data) => {
        console.log("newChannel === ", data);
      }); */
      socket.on("inviteChannel", (channel) => {
        setInvite([channel, ...inviteList]);
      });
      return () => {
        socket.off("message");
        socket.off("exception");
        socket.off("inviteChannel");
      };
    }
  }, [socket, user, channels, currentConv]);

  return (
    <MessageContext.Provider value={{ socket, newMessage, chatList, setChatList }}>
      {children}
    </MessageContext.Provider>
  );
};
