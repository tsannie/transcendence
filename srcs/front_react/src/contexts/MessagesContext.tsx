import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createContext } from "react";
import { IMessageReceived } from "../components/chat/types";
import { api } from "../const/const";
import { SocketContext } from "./SocketContext";

export type MessagesContextType = {
  messagesList: IMessageReceived[];
  setMessagesList: (messagesList: any[]) => void;
  loadMessages: (targetId: number, isDm: boolean) => void;
  isDm: boolean;
  setIsDm: (isDm: boolean) => void;
  convId: number;
  setConvId: (convId: number) => void;
};

export const MessagesContext = createContext<MessagesContextType>({
  messagesList: [],
  setMessagesList: () => { },
  loadMessages: () => { },
  isDm: true,
  setIsDm: () => { },
  convId: 0,
  setConvId: () => { },
});

interface MessagesContextProps {
  children: JSX.Element | JSX.Element[];
}

export const MessagesProvider = ({ children }: MessagesContextProps) => {
  const [isDm, setIsDm] = useState(true);
  const [messageState, setMessageState] = useState<{
    currentConvId: number;
    messages: any[];
  }>({
    currentConvId: 0,
    messages: [],
  });
  const socket = useContext(SocketContext);

  const setMessages = useCallback(
    (newMessageList: any) =>
      setMessageState((oldMessageState) => ({
        ...oldMessageState,
        messages: newMessageList,
      })),
    []
  );

  const setCurrentConv = useCallback(
    (newConvId: any) =>
      setMessageState((oldMessageState) => ({
        ...oldMessageState,
        currentConvId: newConvId,
      })),
    []
  );

  async function loadMessages(id: number, isDm: boolean) {
    if (isDm === true) {
      try {
        const messageList = await api.get("message/dm", {
          params: {
            id: id, // id du dm
            offset: 0,
          },
        });
        setMessages(messageList.data);
      } catch (res) {
        console.log(res);
      }
    }
    else {
      await api
        .get("message/channel", {
          params: {
            id: id, // id du channel
            offset: 0,
          },
        })
        .then((res) => {
          console.log("channel data = ", res.data);
          setMessages(res.data);
        })
        .catch((res) => {
          console.log("invalid messages");
          console.log(res);
        });
    }
  }

  useEffect(() => {
    socket.on("message", (data: IMessageReceived) => {
      const newMsg: IMessageReceived = {
        uuid: data.uuid,
        author: data.author,
        convId: data.dm ? data.dm.id : data.channel.id,
        content: data.content,
        createdAt: data.createdAt,
      };

      setMessageState((oldMessageState) => {
        if (oldMessageState.currentConvId === newMsg.convId) {
          return {
            ...oldMessageState,
            messages: [...oldMessageState.messages, newMsg],
          };
        }

        return oldMessageState;
      });
    });
  }, [socket]);

  return (
    <MessagesContext.Provider
      value={{
        messagesList: messageState.messages,
        setMessagesList: setMessages,
        loadMessages,
        isDm,
        setIsDm,
        convId: messageState.currentConvId,
        setConvId: setCurrentConv,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
};
