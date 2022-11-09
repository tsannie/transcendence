import { createContext, useState } from "react";
import { IChannel, IDm } from "../components/chat/types";

export enum ChatType {
  EMPTY,
  CONV,
  FORM,
}

export interface ChatDisplayContextInterface {
  display: ChatType;
  setDisplay: (display: ChatType) => void;
  currentConv: string;
  setCurrentConv: (conv: string) => void;
  isChannel: boolean;
  setIsChannel: (isChannel: boolean) => void;
  newConv: IChannel | IDm;
  setNewConv: (newConv: IChannel | IDm) => void;
  setTargetRedirection: (target: string) => void;
  setRedirection: (redirection: boolean) => void;
}

export const ChatDisplayContext = createContext<ChatDisplayContextInterface>(
  {} as ChatDisplayContextInterface
);

interface ChatDisplayProviderProps {
  children: JSX.Element | JSX.Element[];
}

export const ChatStateProvider = ({ children }: ChatDisplayProviderProps) => {
  const [display, setDisplay] = useState<ChatType>(ChatType.EMPTY);
  const [currentConv, setCurrentConv] = useState<string>("");
  const [isChannel, setIsChannel] = useState<boolean>(false);
  const [newConv, setNewConv] = useState<IChannel | IDm>({} as IChannel | IDm);
  const [isRedirection, setRedirection] = useState<boolean>(false);
  const [targetRedirection, setTargetRedirection] = useState<string>("");

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
        setTargetRedirection,
        setRedirection,
      }}
    >
      {children}
    </ChatDisplayContext.Provider>
  );
};
