import { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import { api } from "../../const/const";
import { IChannel } from "./types";

const columns = [
  { Header: "title", accessor: "title" },
  { Header: "owner", accessor: "owner" },
  { Header: "status", accessor: "status" },
  { Header: "members", accessor: "members" },
  { Header: "join", accessor: "join" },
];

function ChannelTable() {
  const [channelDictionnary, setChannelDictionnary] = useState<IChannel[]>([]);

  /*const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });*/

  useEffect(() => {
    api
      .get("/channel/list")
      .then((res: AxiosResponse) => {
        setChannelDictionnary(res.data);
      })
      .catch(() => console.log("Axios Error"));
  }, []);

  console.log(channelDictionnary);

  return <div></div>;
}

export default ChannelTable;
