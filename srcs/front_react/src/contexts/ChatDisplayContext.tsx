import { createContext, useState } from "react";
import { IChannel, IDm } from "../components/chat/types";

export enum ChatType {
    EMPTY,
    CONV,
    FORM,
  }
  
export interface ChatDisplayContextInterface {
    display: ChatType;
    changeDisplay: (newDisplay: ChatType) => void;
    currentConvId: string;
    changeCurrentConv: (newConv: string) => void;
    isChannel: boolean;
    changeIsChannel: (newIsChannel: boolean) => void;
    newConv: IChannel | IDm;
    changeNewConv : (newConv: IChannel | IDm) => void;
}


export const ChatDisplayContext = createContext<ChatDisplayContextInterface>({} as ChatDisplayContextInterface);

interface ChatDisplayProviderProps {
    children: JSX.Element | JSX.Element[];
}

export const ChatStateProvider = ({ children }: ChatDisplayProviderProps) => {
    const [ display, setDisplay ] = useState<ChatType>(ChatType.EMPTY);
    const [ currentConvId, setCurrentConv ] = useState<string>("");
    const [ isChannel, setIsChannel ] = useState<boolean>(false);
    const [ newConv, setNewConv ] = useState<IChannel | IDm>({} as IChannel | IDm);
  
    const changeDisplay = (newDisplay: ChatType) => {
      setDisplay(newDisplay);
    }

    const changeCurrentConv = (newConv: string) => {
        setCurrentConv(newConv);
    }

    const changeIsChannel = (newIsChannel: boolean) => {
      setIsChannel(newIsChannel);
    }

    const changeNewConv = (newConv: IChannel | IDm) => {
      setNewConv(newConv);
    }
  
    return (
      <ChatDisplayContext.Provider value={{display, changeDisplay, currentConvId, changeCurrentConv, isChannel, changeIsChannel, newConv, changeNewConv}}>{children}</ChatDisplayContext.Provider>
    )
} 