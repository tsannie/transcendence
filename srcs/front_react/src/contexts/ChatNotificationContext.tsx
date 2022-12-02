import React, { useEffect, useState } from "react";

export const ChatNotifContext = React.createContext<INotifContext>({} as INotifContext);

export interface INotifContext {
    channels: string[];
    addChannel: (convId: string) => void;
    removeChannel : (convId: string) => void;
}

interface ChatNotifProvider {
    children: JSX.Element | JSX.Element[];
  }

const ChatNotifProvider = ({ children }: ChatNotifProvider) => {
    const [channels, setChannels] = useState<string[]>([]);

    const addChannel = ( convId: string) => {
        if (channels.find((channelId) => channelId === convId))
            return ;
        setChannels([...channels, convId]);
    }

    const removeChannel = ( convId : string ) => {
        if (!channels)
            return ;
        setChannels(channels.filter( channelId => channelId != convId));
    }

    return (
        <ChatNotifContext.Provider value={{ channels, addChannel, removeChannel} as INotifContext}>{children}</ChatNotifContext.Provider>
    );
}

export default ChatNotifProvider;
