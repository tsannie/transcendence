import { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import { api } from "../../const/const";
import ChannelTable from "./ChannelTable";
import { IChannel } from "./types";

function JoinChannelForm() {
  const [channelDictionnary, setChannelDictionnary] = useState<IChannel[]>([]);

  useEffect(() => {
    api
      .get("/channel/list")
      .then((res: AxiosResponse) => {
        setChannelDictionnary(res.data);
      })
      .catch(() => console.log("Axios Error"));
  }, []);

  return (
    <div className="channel_table">
      <ChannelTable data={channelDictionnary} />
    </div>
  );
}

export default JoinChannelForm;
