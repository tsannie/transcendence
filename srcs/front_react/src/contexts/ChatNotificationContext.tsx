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
        const copyChan = channels;
        if (copyChan.find((channel) => channel.id === convId))
            return ;
        copyChan.push({id: convId, notif: notif});
        setChannels(copyChan);
    }

    const changeNotif = (convId: string, notif: boolean) => {
        const copyChan = channels.map( (channel: INotif) => {
            if (channel.id === convId)
                channel.notif = notif;
            return channel;
        })
        setChannels(copyChan);
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
