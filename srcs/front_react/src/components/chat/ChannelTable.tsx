import React from "react";
import "./chat.style.scss";

export type Data = {
  name: string;
  owner: string;
  status: string;
};

function ChannelTable() {
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
    </div>
  );
}

export default ChannelTable;
