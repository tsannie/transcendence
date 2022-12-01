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
import { TransitionContext } from "./TransitionContext";

export const MessageContext = createContext<MessageContextInterface>(
  {} as MessageContextInterface
);

export interface MessageContextInterface {
  socket: Socket | null;
  newMessage: IMessageReceived | null;
  chatList: (IChannel | IDm)[];
  setChatList: React.Dispatch<React.SetStateAction<(IChannel | IDm)[]>>;
  channelNotification: boolean;
  setChannelNotification: React.Dispatch<React.SetStateAction<boolean>>;
  inviteList: IChannel[];
  setInvite: React.Dispatch<React.SetStateAction<IChannel[]>>;
}

interface MessageProviderProps {
  children: JSX.Element | JSX.Element[];
}

export const MessageProvider = ({ children }: MessageProviderProps) => {
  const [ channelNotification, setChannelNotification ] = useState<boolean>(false);
  const [newMessage, setNewMessage] = useState<IMessageReceived | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [chatList, setChatList] = useState<(IChannel | IDm)[]>([]);
  const [ inviteList, setInvite ] = useState<IChannel[]>([]);
  //const { inviteList, setInvite } = useContext(ChatDisplayContext);

  const { displayLocation } = useContext(TransitionContext);
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
        setNewMessage(data);
        if (displayLocation.pathname !== "/chat" && (user?.id !== data.author.id))
          toast.info(`new message from ${data.author.username}`)
      });
      socket.on("exception", (response) => {
        toast.error("exception:" + response.message);
      });
      /* socket.on("newChannel", (data) => {
        console.log("newChannel === ", data);
      }); */
      socket.on("inviteChannel", (channel, target) => {
        console.log("channel === ", channel);
        console.log("invite list === ", inviteList);
        if (displayLocation.pathname !== "/chat" && (user?.id !== channel.owner.id)) {
          toast.info(`${channel.owner.username} invited you to ${channel.name}`);
          setChannelNotification(true);
        }
        // set invite only if target is not member of channel
        if (target.id !== channel.users.find( (elem: User) => elem.id === target.id)?.id) {
          console.log("pas la stp");
          if (inviteList.length > 0) {
            setInvite([...inviteList, channel]);
          }
          else {
            setInvite([channel]);
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
  }, [socket, user, displayLocation, channelNotification]);

  return (
    <MessageContext.Provider value={{ socket, newMessage, chatList, setChatList, channelNotification, setChannelNotification, inviteList, setInvite}}>
      {children}
    </MessageContext.Provider>
  );
};
