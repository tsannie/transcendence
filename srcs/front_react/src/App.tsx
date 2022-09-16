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
import TwoFactorCode from "./Auth/TwoFactorCode";

export default function App() {
  const [inputChat, setInputChat] = useState(false);
  const [inputSettings, setInputSettings] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [is2fa, setIs2fa] = useState(false);
  const [validationCode, setValidationCode] = useState(false);

  //console.log('islogin = ' + isLogin);
  /*if (document.cookie.includes(COOKIE_NAME)) {
    //console.log('cookie exist');
    api.post('2fa/auth2fa').then(res => {
      setIsLogin(true);
    }).catch(res => {
      console.log('invalid jwt');
      //console.log(res)
      document.cookie = COOKIE_NAME + '=; Max-Age=-1;;';
    });
  }*/

  useEffect(() => {
    if (document.cookie.includes(COOKIE_NAME)) {
      api.get('auth/isTwoFactor').then(res => {
        setIs2fa(res.data.isTwoFactor);
      }).catch(res => {
        console.log('invalid jwt');
        //console.log(res)
        //setIsLogin(false);
        //document.cookie = COOKIE_NAME + '=; Max-Age=-1;;';
      });
      console.log('is2fa = ' + is2fa);
      if (is2fa === false) {
        setIsLogin(true);
      } else {
        setIsLogin(false);
      }
    }
  });
        //setIs2fa(res.data.isTwoFactor);

  // TODO ask dov what is that ??????
  /*useEffect(() => {
    const strIsLogin = JSON.parse(window.localStorage.getItem("isLogin") || "null");
    //console.log("strislogin = " + strIsLogin)
    setIsLogin(strIsLogin);
  }, []);*/

  if (!isLogin) {
    return (
      <Box sx={{
          bgcolor: "rgba(0, 0, 0, 0.70)",
          height: "100vh",
          pt: "2vh",
      }}>
      <Box sx={{
          display: "flex",
          justifyContent: "center",
      }}>
      <img src={LogoIcon}></img>
      </Box>
        {!is2fa &&
          <ButtonLogin isLogin={isLogin} setIsLogin={setIsLogin} />
        }
        {is2fa &&
          <TwoFactorCode />
        }
      </Box>
    );
  } else {
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
}
