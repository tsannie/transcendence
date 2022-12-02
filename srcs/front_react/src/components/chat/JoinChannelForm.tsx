import { AxiosResponse } from "axios";
import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ReactComponent as RefreshIcon } from "../../assets/img/icon/refresh.svg";
import { api } from "../../const/const";
import {
  ChatDisplayContext,
  ChatType,
} from "../../contexts/ChatDisplayContext";
import { MessageContext } from "../../contexts/MessageContext";
import ChannelTable from "./ChannelTable";
import SearchBarChannel from "./SearchBarChannel";
import { IChannel } from "./types";

function JoinChannelForm() {
  const [channelDictionnary, setChannelDictionnary] = useState<IChannel[]>([]);
  const [selectionChannels, setSelectionChannels] = useState<IChannel[]>([]);
  const [selectChannel, setSelectChannel] = useState<IChannel>();
  const [refresh, setRefresh] = useState<boolean>(true);
  const [password, setPassword] = useState<string>("");
  const {
    setMuted,
    setMuteDate,
    setDisplay,
    setCurrentConv,
    setIsChannel,
    setNewConv,
    setRedirection,
    setTargetRedirection,
  } = useContext(ChatDisplayContext);
  const { socket } = useContext(MessageContext);

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
    if (selectChannel) {
      api
        .post(
          `/channel/join`,
          selectChannel.status === "Public"
            ? { id: selectChannel.id }
            : { id: selectChannel.id, password: password }
        )
        .then((res: AxiosResponse) => {
          setCurrentConv(res.data.id);
          setIsChannel(true);
          setNewConv(res.data);
          setDisplay(ChatType.CONV);
        })
        .catch((err) => {
          toast.error(err.response.data.message);
        });
    }
  };

  useEffect(() => {
    setMuted(false);
    setMuteDate(null);
    setRedirection(false);
    setTargetRedirection("");
  }, []);

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
          <input
            type="password"
            placeholder="password"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
          />
        )}
        {selectChannel && <button>join</button>}
      </form>
    </div>
  );
}

export default JoinChannelForm;
