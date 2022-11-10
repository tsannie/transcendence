import { AxiosResponseHeaders } from "axios";
import React, { useEffect, useState } from "react";
import { api } from "../../const/const";
import ChannelTable from "./ChannelTable";
import { IChannel } from "./types";

function JoinChannelForm() {
  const [channelDictionnary, setChannelDictionnary] = useState<IChannel[]>([]);

  useEffect(() => {
    api
      .get("/channel/list")
      .then((res: AxiosResponseHeaders) => {
        setChannelDictionnary(res.data);
      })
      .catch(() => console.log("Axios Error"));
  }, []);

  return (
    <div className="channel_table">
      <ChannelTable />
    </div>
  );
}

export default JoinChannelForm;
