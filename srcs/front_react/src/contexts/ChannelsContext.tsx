import React, { createContext, useEffect, useState } from "react";
import { IChannel } from "../components/chat/types";
import { api } from "../const/const";

export type ChannelsContextType = {
  channelsList: IChannel[];
  setChannelsList: (channelsList: IChannel[]) => void;
  getChannelsUserlist: () => void;
  channelData: any;
  setChannelData: (channelData: any) => void;
};

export const ChannelsContext = createContext<ChannelsContextType>({
  channelsList: [],
  setChannelsList: () => {},
  getChannelsUserlist: () => {},
  channelData: {},
  setChannelData: () => {},
});

interface ChannelsContextProps {
  children: JSX.Element | JSX.Element[];
}

export const ChannelsProvider = ({ children }: ChannelsContextProps) => {
  const [channelsList, setChannelsList] = useState<IChannel[]>([]);
  const [channelData, setChannelData] = useState<IChannel>();

  // get all channels
  async function getChannelsUserlist() {
    console.log("get channels");
    await api
      .get("channel/userlist")
      .then((res) => {
        setChannelsList(res.data);
        console.log(res.data);
      })
      .catch((res) => {
        console.log("invalid channels");
        console.log(res);
      });
  }

  // get all channels
  useEffect(() => {
    getChannelsUserlist();
  }, []);

  return (
    <ChannelsContext.Provider
      value={{
        channelsList,
        setChannelsList,
        getChannelsUserlist,
        channelData,
        setChannelData,
      }}
    >
      {children}
    </ChannelsContext.Provider>
  );
};
