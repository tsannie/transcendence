import {
  Box,
  Button,
  createTheme,
  Icon,
  IconButton,
  ThemeProvider,
  Typography,
} from "@mui/material";

import React, { createContext, useContext, useEffect, useState } from "react";

import ButtonLogin from "./Auth/ButtonLogin";
import ButtonLogout from "./Auth/ButtonLogout";
import Chat from "./components/chat/Chat";
import Sidebar from "./components/sidebar/Sidebar";
import UserList from "./userlist/UserListItem";
import LogoIcon from "./assets/logo-project.png";

export const LoginContext = createContext({});

export default function App() {
  const [inputChat, setInputChat] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const a = JSON.parse(window.localStorage.getItem("isLogin") || "");
    setIsLogin(a);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("isLogin", JSON.stringify(isLogin));
  }, [isLogin]);

  if (!isLogin)
    return (
      <Box
        sx={{
          bgcolor: "rgba(0, 0, 0, 0.70)",
          height: "100vh",
          pt: "2vh",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img src={LogoIcon}></img>
        </Box>
        <ButtonLogin isLogin={isLogin} setIsLogin={setIsLogin} />
      </Box>
    );
  return (
    <Box
      sx={{
        display: "flex",
      }}
    >
      <Sidebar
        inputChat={inputChat}
        setInputChat={setInputChat}
        isLogin={isLogin}
        setIsLogin={setIsLogin}
      />
      {inputChat && <Chat />}
      {!isLogin && <ButtonLogout />}
    </Box>
  );
}
