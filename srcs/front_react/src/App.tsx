import {
  Box
} from "@mui/material";

import React, { createContext, useContext, useEffect, useState } from "react";

import ButtonLogin from "./Auth/ButtonLogin";
import Chat from "./components/chat/Chat";
import Sidebar from "./components/sidebar/Sidebar";
import UserList, { api } from "./userlist/UserListItem";
import LogoIcon from "./assets/logo-project.png";
import { COOKIE_NAME } from "./const";
import Settings from "./components/settings/Settings";

export default function App() {
  const [inputChat, setInputChat] = useState(false);
  const [inputSettings, setInputSettings] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  //console.log('islogin = ' + isLogin);
  if (document.cookie.includes(COOKIE_NAME)) {
    //console.log('cookie exist');
    api.get('auth/profile').then(res => {
      setIsLogin(true);
    }).catch(res => {
      console.log('invalid jwt');
      //console.log(res)
      document.cookie = COOKIE_NAME + '=; Max-Age=-1;;';
    });
  }

  // TODO ask dov what is that ??????
  /*useEffect(() => {
    const strIsLogin = JSON.parse(window.localStorage.getItem("isLogin") || "null");
    //console.log("strislogin = " + strIsLogin)
    setIsLogin(strIsLogin);
  }, []);*/

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
        setInputChat={setInputChat}
        setInputSettings={setInputSettings}
        isLogin={isLogin}
        setIsLogin={setIsLogin}
      />
      {inputChat && <Chat />}
      {inputSettings && <Settings />}
    </Box>
  );
}
