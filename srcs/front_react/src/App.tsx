import {
  Box
} from "@mui/material";

import React, { createContext, useContext, useEffect, useState } from "react";

import ButtonLogin from "./Auth/ButtonLogin";
import Chat from "./components/chat/Chat";
import Sidebar from "./components/sidebar/Sidebar";
import LogoIcon from "./assets/logo-project.png";
import Settings from "./components/settings/Settings";
import TwoFactorCode from "./Auth/TwoFactorCode";
import { api, COOKIE_NAME } from "./const/const";

export default function App() {
  const [inputChat, setInputChat] = useState(false);
  const [inputSettings, setInputSettings] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [is2FA, setIs2FA] = useState(false);
  const [confirmed2FA, setConfirmed2FA] = useState(false);

  useEffect(() => {
    if (document.cookie.includes(COOKIE_NAME) && is2FA === true) {
      api.get('auth/profile').then(res => {
        setConfirmed2FA(true);
      }).catch(res => {
        setConfirmed2FA(false);
      });
    }
  });

  useEffect(() => {
    if (document.cookie.includes(COOKIE_NAME)) {
      api.get('auth/isTwoFactor').then(res => {
        setIs2FA(res.data.isTwoFactor);
      }).catch(res => {
        console.log('invalid jwt');
        document.cookie = COOKIE_NAME + '=; Max-Age=-1;;';
      });
      console.log('is2fa = ' + is2FA);
      console.log('confirmed2fa = ' + confirmed2FA);
      if (is2FA === false) {
        setIsLogin(true);
      } else if (is2FA === true && confirmed2FA === false) {
        setIsLogin(false);
      } else if (is2FA === true && confirmed2FA === true) {
        setIsLogin(true);
      }
    }
  });

  console.log('islogin = ' + isLogin);

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
        {!is2FA &&
          <ButtonLogin isLogin={isLogin} setIsLogin={setIsLogin} />
        }
        {is2FA &&
          <TwoFactorCode setConfirmed2FA={setConfirmed2FA}/>
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
          setIsLogin={setIsLogin}
          setIs2FA={setIs2FA}
        />
        {inputChat && <Chat />}
        {inputSettings && <Settings />}
      </Box>
    );
  }
}
