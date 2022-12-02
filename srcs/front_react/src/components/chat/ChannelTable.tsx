import { useRef } from "react";
import { Link } from "react-router-dom";
import { ReactComponent as LockIcon } from "../../assets/img/icon/lock.svg";
import { ReactComponent as UnlockIcon } from "../../assets/img/icon/unlock.svg";
import "./chat.style.scss";
import { IChannel } from "./types";

interface IProps {
  data: IChannel[];
  setSelectChannel: (channel: IChannel) => void;
}

function ChannelTable(props: IProps) {
  const refChannel = useRef<HTMLDivElement>(null);

  const handleClicked = (e: any, channel: IChannel) => {
    e.preventDefault();
    if (refChannel.current) {
      refChannel.current.focus(); // Doesn't work
    }
    props.setSelectChannel(channel);
  };

  let allFriends = props.data.map((channel) => {
    return (
      <div
        className="table__item channel"
        key={channel.id}
        onClick={(e) => handleClicked(e, channel)}
      >
        <div className="table__item__name">
          <span>{channel.name}</span>
        </div>
        <div className="table__item__owner">
          <Link
            style={{ textDecoration: "none" }}
            to={`/profile/${channel.owner?.username}`}
          >
            <span
              title={
                channel.owner?.username && channel.owner?.username.length > 5
                  ? channel.owner?.username
                  : ""
              }
            >
              {channel.owner?.username && channel.owner?.username.length > 10
                ? channel.owner?.username.slice(0, 5) + "..."
                : channel.owner?.username}
            </span>
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
      {allFriends.length ? (
        <div className="table__body">{allFriends}</div>
      ) : (
        <div className="table__body">
          <span>No channel found</span>
        </div>
      )}
    </div>
  );
}

export default ChannelTable;
