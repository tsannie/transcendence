import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";
import { io, Socket } from "socket.io-client";
import { IChannel, IDm, IMessageReceived } from "../components/chat/types";
import { AuthContext, User } from "./AuthContext";
import { ChatDisplayContext } from "./ChatDisplayContext";
import { ChatNotifContext } from "./ChatNotificationContext";
import { TransitionContext } from "./TransitionContext";

export const MessageContext = createContext<MessageContextInterface>(
  {} as MessageContextInterface
);

export interface MessageContextInterface {
  socket: Socket | null;
  newMessage: IMessageReceived | null;
  setNewMessage: React.Dispatch<React.SetStateAction<IMessageReceived | null>>;
  chatList: (IChannel | IDm)[];
  setChatList: React.Dispatch<React.SetStateAction<(IChannel | IDm)[]>>;
  inviteList: IChannel[];
  setInvite: React.Dispatch<React.SetStateAction<IChannel[]>>;
}

interface MessageProviderProps {
  children: JSX.Element | JSX.Element[];
}

export const MessageProvider = ({ children }: MessageProviderProps) => {
  const [newMessage, setNewMessage] = useState<IMessageReceived | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [chatList, setChatList] = useState<(IChannel | IDm)[]>([]);
  const [ inviteList, setInvite ] = useState<IChannel[]>([]);
  const { currentConv } = useContext(ChatDisplayContext);
  const { addChannel } = useContext(ChatNotifContext);
  const { displayLocation } = useContext(TransitionContext);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    const newSocket: any = io("http://localhost:4000/chat", {
      transports: ["websocket"],
    });
    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("message", (data) => {
        if (data.author.id !== user?.id)
        {
          if (displayLocation.pathname !== "/chat")
            toast.info(`new message from ${data.author.username}`)
          if (data.channel && 
            (data.channel.id !== currentConv 
              || (data.channel.id === currentConv && displayLocation.pathname !== "/chat")))
            addChannel(data.channel.id);
          else if (data.dm && 
            (data.dm.id !== currentConv
              || (data.dm.id === currentConv && displayLocation.pathname !== "/chat")))
            addChannel(data.dm.id);
        }
        setNewMessage(data);
      });
      socket.on("exception", (response) => {
        toast.error(response.message);
      });
      socket.on("inviteChannel", (channel, targetId) => {
        if (displayLocation.pathname !== "/chat" && (user?.id !== channel.owner.id)) {
          if (targetId !== channel.users.find( (elem: User) => elem.id === targetId)?.id &&
            targetId !== channel.admins.find( (elem: User) => elem.id === targetId)?.id &&
            inviteList.find( (elem: IChannel) => elem.id === channel.id) === undefined
          ) { // if target is not in channel and channel is not in invite list
            toast.info(`${channel.owner.username} invited you to ${channel.name}`);
          }
        }
        // set invite only if target is not member or admins of channel
        if (targetId !== channel.users.find( (elem: User) => elem.id === targetId)?.id &&
          targetId !== channel.admins.find( (elem: User) => elem.id === targetId)?.id &&
          targetId !== channel.owner.id
        ) {
          //console.log("pas la stp");
          // check if channel is not already in invite list
          if (inviteList.find( (elem: IChannel) => elem.id === channel.id) === undefined) {
            if (inviteList.length > 0) {
              setInvite([...inviteList, channel]);
            }
            else {
              setInvite([channel]);
            }
          }
        }
        // add channel to the invite list
      });
      return () => {
        socket.off("message");
        socket.off("exception");
        socket.off("inviteChannel");
      };
    }
  }, [socket, user, currentConv, displayLocation, inviteList]);

  return (
    <MessageContext.Provider value={{ socket, newMessage, setNewMessage, chatList, setChatList, inviteList, setInvite}}>
      {children}
    </MessageContext.Provider>
  );
};
