import {
  Box,
  Button,
  createTheme,
  Icon,
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
import LogoIconSvg from "./assets/logo-project.svg";

export const LoginContext = createContext({});

export default function App() {
  const [inputChat, setInputChat] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  if (!isLogin)
    return (
      <Box>
        <Icon >
          <img src={LogoIconSvg}/>
        </Icon>
        <ButtonLogin isLogin={isLogin} setIsLogin={setIsLogin}/>
        <ButtonLogout isLogin={isLogin} setIsLogin={setIsLogin}/>
        <UserList />
      </Box>
    )
  return (
    <Box
      sx={{
        display: "flex",
      }}
    >
      <Sidebar inputChat={inputChat} setInputChat={setInputChat} />
      {inputChat && <Chat />}
      {/* <ButtonLogin />
      <ButtonLogout />
      <UserList /> */}
    </Box>
  )
}
