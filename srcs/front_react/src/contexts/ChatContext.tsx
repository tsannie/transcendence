import { createContext, useState } from "react";
import { IChannel } from "../components/chat/types";

export enum ChatType {
    EMPTY,
    CONV,
    FORM,
  }
  
export interface ChatContextInterface {
    display: ChatType;
    changeDisplay: (newDisplay: ChatType) => void;
    currentConvId: string;
    changeCurrentConv: (newConv: string) => void;
    isChannel: boolean;
    changeIsChannel: (newIsChannel: boolean) => void;
}


export const ChatStateContext = createContext<ChatContextInterface>({} as ChatContextInterface);

interface ChatStateProviderProps {
    children: JSX.Element | JSX.Element[];
}

export const ChatStateProvider = ({ children }: ChatStateProviderProps) => {
    const [ display, setDisplay ] = useState<ChatType>(ChatType.EMPTY);
    const [ currentConvId, setCurrentConv ] = useState<string>("");
    const [ isChannel, setIsChannel ] = useState<boolean>(false);

    const changeDisplay = (newDisplay: ChatType) => {
      setDisplay(newDisplay);
    }

    const changeCurrentConv = (newConv: string) => {
        setCurrentConv(newConv);
    }

    const changeIsChannel = (newIsChannel: boolean) => {
      setIsChannel(newIsChannel);
    }
  
    return (
      <ChatStateContext.Provider value={{display, changeDisplay, currentConvId, changeCurrentConv, isChannel, changeIsChannel}}>{children}</ChatStateContext.Provider>
    )
} 