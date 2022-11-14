import { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import { api } from "../../const/const";
import ChannelTable from "./ChannelTable";
import { ReactComponent as RefreshIcon } from "../../assets/img/icon/refresh.svg";
import { IChannel } from "./types";
import SearchBarChannel from "./SearchBarChannel";

function JoinChannelForm() {
  const [channelDictionnary, setChannelDictionnary] = useState<IChannel[]>([]);
  const [selectionChannels, setSelectionChannels] = useState<IChannel[]>([]);
  const [refresh, setRefresh] = useState<boolean>(true);

  const sortChannel = (channels: IChannel[]): IChannel[] => {
    const sort = channels.sort((a, b) => {
      if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
      if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
      return 0;
    });
    return sort;
  };

  useEffect(() => {
    if (refresh) {
      api
        .get("/channel/list")
        .then((res: AxiosResponse) => {
          setChannelDictionnary(res.data);
          setSelectionChannels(sortChannel(res.data));
        })
        .catch(() => console.log("Axios Error"));
      setRefresh(false);
    }
  }, [refresh]);

  const handleRefresh = () => {
    setRefresh(true);
  };

  return (
    <div className="join-channel">
      <div className="join-channel__action">
        <div className="join-channel__action__refresh">
          <button onClick={handleRefresh}>
            <RefreshIcon />
          </button>
        </div>
        <SearchBarChannel
          setSelectionChannels={setSelectionChannels}
          channelDictionnary={channelDictionnary}
        />
        <button>create</button>
      </div>
      <div className="channel_table">
        <ChannelTable data={selectionChannels} />
      </div>
    </div>
  );
}

export default JoinChannelForm;
