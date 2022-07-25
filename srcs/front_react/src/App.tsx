<<<<<<< HEAD
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
=======
import React, { useEffect, useState } from 'react';
import FtClock from './game/Clock';
import Game from './game/Game';

export default function App() {
  const [inputGame, setInputGame] = useState("JOUER");
  const [date, setDate] = useState(new Date());
>>>>>>> [+] Canvas game start

import ButtonLogin from "./Auth/ButtonLogin";
import ButtonLogout from "./Auth/ButtonLogout";
import Chat from "./components/chat/Chat";
import Sidebar from "./components/sidebar/Sidebar";
import UserList from "./userlist/UserListItem";
import LogoIcon from "./assets/logo-project.png";

export default function App() {
  const [inputChat, setInputChat] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  console.log(isLogin);

  useEffect(() => {
    const strIsLogin = JSON.parse(window.localStorage.getItem("isLogin") || "null");
    setIsLogin(strIsLogin);
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
    //<ButtonLogout isLogin={isLogin} setIsLogin={setIsLogin} />
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
    </Box>
  );
}
