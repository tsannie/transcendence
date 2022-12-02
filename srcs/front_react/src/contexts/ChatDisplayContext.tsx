import React, { createContext, useState } from "react";
import { IChannel, IDm } from "../components/chat/types";

export enum ChatType {
  EMPTY,
  CONV,
  CREATEFORM,
  JOINFORM,
}

export interface ChatDisplayContextInterface {
  display: ChatType;
  setDisplay: React.Dispatch<React.SetStateAction<ChatType>>;
  currentConv: string;
  setCurrentConv: React.Dispatch<React.SetStateAction<string>>;
  isChannel: boolean;
  setIsChannel: React.Dispatch<React.SetStateAction<boolean>>;
  newConv: IChannel | IDm;
  setNewConv: React.Dispatch<React.SetStateAction<IChannel | IDm>>;

  isRedirection: boolean;
  setRedirection: React.Dispatch<React.SetStateAction<boolean>>;

  targetRedirection: string;
  setTargetRedirection: React.Dispatch<React.SetStateAction<string>>;
  isMuted: boolean;
  setMuted: React.Dispatch<React.SetStateAction<boolean>>;
  muteDate: Date | null;
  setMuteDate: React.Dispatch<React.SetStateAction<Date | null>>;
}

export const ChatDisplayContext = createContext<ChatDisplayContextInterface>(
  {} as ChatDisplayContextInterface
);

interface ChatDisplayProviderProps {
  children: JSX.Element | JSX.Element[];
}

export const ChatDisplayProvider = ({ children }: ChatDisplayProviderProps) => {
  const [display, setDisplay] = useState<ChatType>(ChatType.CONV);
  const [currentConv, setCurrentConv] = useState<string>("");
  const [isChannel, setIsChannel] = useState<boolean>(false);
  const [newConv, setNewConv] = useState<IChannel | IDm>({} as IChannel | IDm);
  const [isRedirection, setRedirection] = useState<boolean>(false);
  const [targetRedirection, setTargetRedirection] = useState<string>("");
  const [isMuted, setMuted] = useState<boolean>(false);
  const [muteDate, setMuteDate] = useState<Date | null>(null);

  return (
    <ChatDisplayContext.Provider
      value={{
        display,
        setDisplay,
        currentConv,
        setCurrentConv,
        isChannel,
        setIsChannel,
        newConv,
        setNewConv,
        isRedirection,
        setRedirection,
        targetRedirection,
        setTargetRedirection,
        isMuted,
        setMuted,
        muteDate,
        setMuteDate,
      }}
    >
      {children}
    </ChatDisplayContext.Provider>
  );
};
