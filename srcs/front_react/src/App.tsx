import { Box } from "@mui/material";
import React, { useState } from "react";
import Login from "./Auth/Login";
import Chat from "./components/chat/Chat";
import Sidebar from "./components/sidebar/Sidebar";
import UserList from "./userlist/UserListItem";

export default function App() {
  const [inputChat, setInputChat] = useState(false);

  return (
    <Box
      sx={{
        display: "flex",
      }}
    >
      <Sidebar inputChat={inputChat} setInputChat={setInputChat} />
      {inputChat && <Chat />}
    </Box>
  );
}
