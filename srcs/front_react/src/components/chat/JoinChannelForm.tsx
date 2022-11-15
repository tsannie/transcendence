import { AxiosError, AxiosResponse } from "axios";
import React, { FormEvent, useContext, useEffect, useState } from "react";
import { api } from "../../const/const";
import ChannelTable from "./ChannelTable";
import { ReactComponent as RefreshIcon } from "../../assets/img/icon/refresh.svg";
import { IChannel } from "./types";
import SearchBarChannel from "./SearchBarChannel";
import {
  ChatDisplayContext,
  ChatType,
} from "../../contexts/ChatDisplayContext";
import { toast } from "react-toastify";

function JoinChannelForm() {
  const [channelDictionnary, setChannelDictionnary] = useState<IChannel[]>([]);
  const [selectionChannels, setSelectionChannels] = useState<IChannel[]>([]);
  const [selectChannel, setSelectChannel] = useState<IChannel>();
  const [refresh, setRefresh] = useState<boolean>(true);
  const [password, setPassword] = useState<string>("");
  const { setDisplay } = useContext(ChatDisplayContext);

  const sortChannel = (channels: IChannel[]): IChannel[] => {
    const sort = channels.sort((a, b) => {
      if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
      if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
      return 0;
    });
    return sort;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submit");
    if (selectChannel) {
      api
        .post(`/channels/${selectChannel.id}/join`)
        .then((res: AxiosResponse) => {
          toast.success("Channel joined");
          setDisplay(ChatType.CONV);
        })
        .catch((err: AxiosError) => {
          toast.error("Wrong password");
        });
    }
  };

  useEffect(() => {
    if (refresh) {
      api
        .get("/channel/list")
        .then((res: AxiosResponse) => {
          setChannelDictionnary(res.data);
          setSelectionChannels(sortChannel(res.data));
        })
        .catch(() => console.log("Error while fetching channels"));
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
        <button onClick={() => setDisplay(ChatType.CREATEFORM)}>create</button>
      </div>
      <div className="channel_table">
        <ChannelTable
          data={selectionChannels}
          setSelectChannel={setSelectChannel}
        />
      </div>
      <form className="join-channel__footer" onSubmit={handleSubmit}>
        {selectChannel && selectChannel.status === "Protected" && (
          <input type="password" placeholder="password" />
        )}
        {selectChannel && <button>join</button>}
      </form>
    </div>
  );
}

export default JoinChannelForm;
