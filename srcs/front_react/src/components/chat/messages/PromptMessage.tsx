import { Grid, TextField } from "@mui/material";
import { Box } from "@mui/system";
import React, { useContext, useState } from "react";
import Paperplane from "../../../assets/paperplane.png";
import { DmsContext } from "../../../contexts/DmsContext";
import { MessagesContext } from "../../../contexts/MessagesContext";
import { SocketContext } from "../../../contexts/SocketContext";
import { UserContext } from "../../../contexts/UserContext";
import { IMessage } from "../types";

interface PromptMessageProps {}

export default function PromptMessage(props: PromptMessageProps) {
  const { convId } = useContext(MessagesContext);
  const { userConnected } = useContext(UserContext);
  const { isDm } = useContext(MessagesContext);
  const [currentMessage, setCurrentMessage] = useState("");
  const socket = useContext(SocketContext);

  function sendMessage(id: number) {
    console.log("send message");
    const inputMessage = document.getElementById(
      "input-message"
    ) as HTMLInputElement;

    inputMessage.value = "";
    if (currentMessage !== "") {
      const messageData: Partial<IMessage> = {
        id: id,
        author: userConnected,
        content: currentMessage,
        isDm: isDm,
      };
      socket.emit("message", messageData);
      setCurrentMessage("");
    }
  }

  return (
    <Box>
      <TextField
        id="input-message"
        variant="outlined"
        placeholder="Enter a message"
        onChange={(event) => {
          setCurrentMessage(event.target.value);
        }}
      />
      <Box
        component="img"
        alt="send message img"
        src={Paperplane}
        onClick={() => sendMessage(convId)}
        sx={{
          width: 18,
          height: 18,
          position: "absolute",
        }}
      ></Box>
    </Box>
  );
}
