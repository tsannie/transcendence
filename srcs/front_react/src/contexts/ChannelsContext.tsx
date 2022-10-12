import React, { createContext, useEffect, useState } from "react";
import { IChannel } from "../components/chat/types";
import { api } from "../const/const";

export type ChannelsContextType = {
  channelsList: IChannel[];
  setChannelsList: (channelsList: IChannel[]) => void;
  getChannelsUserlist: () => void;
  channelData: any;
  setChannelData: (channelData: any) => void;
  availableChannels: IChannel[];
  setAvailableChannels: (availableChannels: IChannel[]) => void;
  getAvailableChannels: () => void;
};

export const ChannelsContext = createContext<ChannelsContextType>({
  channelsList: [],
  setChannelsList: () => {},
  getChannelsUserlist: () => {},
  channelData: {},
  setChannelData: () => {},
  availableChannels: [],
  setAvailableChannels: () => {},
  getAvailableChannels: () => {},
});

interface ChannelsContextProps {
  children: JSX.Element | JSX.Element[];
}

export const ChannelsProvider = ({ children }: ChannelsContextProps) => {
  const [channelsList, setChannelsList] = useState<IChannel[]>([]);
  const [channelData, setChannelData] = useState<IChannel>();
  const [availableChannels, setAvailableChannels] = useState<any[]>([]);

  // get all available channels
  async function getAvailableChannels() {
    await api
      .get("channel/list", {
        params: {
          offset: 0,
        },
      })
      .then((res) => {
        setAvailableChannels(res.data);
        console.log(res.data);
      })
      .catch((res) => {
        console.log("invalid available channels");
        console.log(res);
      });
  }

  // get all channels
  async function getChannelsUserlist() {
    await api
      .get("channel/userlist")
      .then((res) => {
        setChannelsList(res.data);
        console.log(res.data);
      })
      .catch((res) => {
        console.log("invalid userlist channels");
        console.log(res);
      });
  }

  // get all channels
  useEffect(() => {
    getChannelsUserlist();
    getAvailableChannels();
  }, []);

  return (
    <ChannelsContext.Provider
      value={{
        channelsList,
        setChannelsList,
        getChannelsUserlist,
        channelData,
        setChannelData,
        availableChannels,
        setAvailableChannels,
        getAvailableChannels,
      }}
    >
      {children}
    </ChannelsContext.Provider>
  );
};
