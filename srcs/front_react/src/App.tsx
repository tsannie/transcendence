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
import Login from "./Auth/Login";
import Register from "./Auth/Register";
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
