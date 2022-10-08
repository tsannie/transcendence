import React, { useEffect, useState } from "react";
import { api } from "../const/const";
import { IChannel } from "../components/chat/types";

export type ChannelsContextType = {
  channelsList: IChannel[];
  setChannelsList: (channelsList: IChannel[]) => void;
  getChannelsUserlist: () => void;
  availableChannels: IChannel[];
  setAvailableChannels: (availableChannels: IChannel[]) => void;
  getAvailableChannels: () => void;
};

export const ChannelsContext = React.createContext<ChannelsContextType>({
  channelsList: [],
  setChannelsList: () => {},
  getChannelsUserlist: () => {},
  availableChannels: [],
  setAvailableChannels: () => {},
  getAvailableChannels: () => {},
});

interface ChannelContextProps {
  children: JSX.Element | JSX.Element[];
}

export const ChannelsProvider = ({ children }: ChannelContextProps) => {
  const [channelsList, setChannelsList] = useState<IChannel[]>([]);
  const [availableChannels, setAvailableChannels] = useState<any[]>([]);


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

  async function getAvailableChannels() {
    console.log("get available channels");
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
        console.log("invalid channels");
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
        availableChannels,
        setAvailableChannels,
        getAvailableChannels,
      }}
    >
      {children}
    </ChannelsContext.Provider>
  );
};
