import {
  Box,
  Button,
  createTheme,
  IconButton,
  ThemeProvider,
  Typography,
  useTheme,
} from "@mui/material";

import React, { createContext, useContext, useMemo, useState } from "react";
import ButtonLogin from "./Auth/Login";
import Login from "./Auth/Login";
import ButtonLogout from "./Auth/Logout";
import Chat from "./components/chat/Chat";
import Sidebar from "./components/sidebar/Sidebar";
import UserList from "./userlist/UserListItem";

export default function App() {
  const [inputChat, setInputChat] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  console.log(isConnected);
  if (!isConnected)
    return (
    <Box>
      <ButtonLogin isLogin={setIsConnected}/>
      <UserList />
    </Box>
    )
  return (
    <Box
      sx={{
        display: "flex",
      }}
    >
      <Sidebar inputChat={inputChat} setInputChat={setInputChat}
        isConnected={isConnected} setIsConnected={setIsConnected} />
      {inputChat && <Chat /> && <ButtonLogout />}
    </Box>
  );
}
