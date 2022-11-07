import React, { useState } from "react";

export const NotifContext = React.createContext<INotifContext>({} as INotifContext);

export interface INotif {
    id: string;
    notif: boolean;
}

export interface INotifContext {
    channels: INotif[];
    addChannel: (convId: string, notif: boolean) => void;
    changeNotif: (convId: string, notif: boolean) => void;
    isNotif : (convId: string) => boolean;
}

interface NotifProvider {
    children: JSX.Element | JSX.Element[];
  }

const NotifProvider = ({ children }: NotifProvider) => {
    const [channels, setChannels] = useState<INotif[]>([]);

    const addChannel = ( convId: string, notif: boolean ) => {
        if (channels.find((channel) => channel.id === convId))
            return ;
        setChannels([...channels, { id: convId, notif: notif }]);
    }

    const changeNotif = (convId: string, notif: boolean) => {
        setChannels(channels.map( (channel: INotif) => {
            if (channel.id === convId)
                channel.notif = notif;
            return channel;
        }));
    }

    const isNotif = (convId: string) => {
        let channel = channels.find( (channel) => channel.id === convId);

        return channel?.notif;
    }

    return (
        <NotifContext.Provider value={{ channels, addChannel, changeNotif, isNotif } as INotifContext}>{children}</NotifContext.Provider>
    );
}

export default NotifProvider;
