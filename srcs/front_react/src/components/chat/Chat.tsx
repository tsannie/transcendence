import { Box, Grid, Popover, Typography } from "@mui/material";
import { useState } from "react";
import { IChannel, IMessageReceived } from "./types";
import { api, COOKIE_NAME } from "../../const/const";
import { ChatProvider } from "../../contexts/ChatContext";
import "./chat.style.scss"

function Chat() {


  return (
    <ChatProvider>
      <div className="chat">
      <div className="chat__list"></div>
      </div>
    </ChatProvider>
  );
}

export default Chat;
