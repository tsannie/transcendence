import { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import { api } from "../../const/const";
import "./chat.style.scss";
import { IChannel } from "./types";
import { ReactComponent as LockIcon } from "../../assets/img/icon/lock.svg";
import { ReactComponent as UnlockIcon } from "../../assets/img/icon/unlock.svg";
import { Link } from "react-router-dom";

interface IProps {
  data: IChannel[];
}

function ChannelTable(props: IProps) {
  let allFriends = props.data.map((channel) => {
    return (
      <div className="table__item channel" key={channel.id}>
        <div className="table__item__name">
          <span>{channel.name}</span>
        </div>
        <div className="table__item__owner">
          <Link to={`/profile/${channel.owner?.username}`}>
            <span>{channel.owner?.username}</span>
          </Link>
        </div>
        <div className="table__item__status">
          {channel.status === "Public" ? <UnlockIcon /> : <LockIcon />}
        </div>
      </div>
    );
  });
  return (
    <div className="table">
      <div className="table__item ">
        <div className="table__item__name header">
          <span>Channel Name</span>
        </div>
        <div className="table__item__owner header">
          <span>Owner</span>
        </div>
        <div className="table__item__status header">
          <span>Status</span>
        </div>
      </div>
      <div className="table__body">{allFriends}</div>
    </div>
  );
}

export default ChannelTable;
