import { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import { api } from "../../const/const";
import "./chat.style.scss";
import { IChannel } from "./types";

interface IProps {
  data: IChannel[];
}

function ChannelTable(props: IProps) {
  let allFriends = props.data.map((channel, index) => {
    return (
      <div className="table__item" key={channel.id}>
        <div className="table__item__name">
          <span>{channel.name}</span>
        </div>
        <div className="table__item__owner">
          <span>{channel.owner?.username}</span>
        </div>
        <div className="table__item__status">
          <span>{channel.status}</span>
        </div>
      </div>
    );
  });
  return (
    <div className="table">
      <div className="table__item">
        <div className="table__item__name">
          <span>Channel Name</span>
        </div>
        <div className="table__item__owner">
          <span>Owner</span>
        </div>
        <div className="table__item__status">
          <span>Status</span>
        </div>
      </div>
      <div className="table__body">{allFriends}</div>
    </div>
  );
}

export default ChannelTable;
