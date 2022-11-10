import React from "react";
import "./chat.style.scss";

export type Data = {
  name: string;
  owner: string;
  status: string;
};

function ChannelTable() {
  return (
    <>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>name</th>
            <th>title</th>
            <th>owner</th>
            <th>status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>SalutName</td>
            <td>with two columns</td>
            <td>with two columns</td>
            <td>with two columns</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

export default ChannelTable;
