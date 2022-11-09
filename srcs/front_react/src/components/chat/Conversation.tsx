import { Fragment } from "react";
import MessageBody from "./Channel";
import Options from "./Options";

function Conversation() {
    return (
      <Fragment>
        <MessageBody />
        <Options />
      </Fragment>);
  }

  export default Conversation;