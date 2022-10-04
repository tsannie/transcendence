import {
  Box
} from "@mui/material";

import React, { createContext, useContext, useEffect, useState } from "react";

import ButtonLogin from "./Auth/ButtonLogin";
import Chat from "./components/chat/Chat";
import Sidebar from "./components/sidebar/Sidebar";
import LogoIcon from "./assets/logo-project.png";
import Game from "./game/Game";
import Settings from "./components/settings/Settings";
import TwoFactorCode from "./Auth/TwoFactorCode";
import { api, COOKIE_NAME } from "./const/const";

export default function App() {
  const [inputChat, setInputChat] = useState(false);
  const [inputSettings, setInputSettings] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [inputGame, setInputGame] = useState(false);

  //console.log(isLogin);
  const [is2FA, setIs2FA] = useState(true);

  useEffect(() => {
    if (document.cookie.includes(COOKIE_NAME)) {
      api.get('auth/isTwoFactor').then(res => {
        setIs2FA(res.data.isTwoFactor);
      }).catch(res => {
        console.log('invalid jwt');
        document.cookie = COOKIE_NAME + '=; Max-Age=-1;;';
      });

      console.log('is2FA', is2FA);

      if (is2FA === false) {
        setIsLogin(true);
      } else if (is2FA === true) {
        api.get('auth/profile').then(res => {
          setIsLogin(true);
        }).catch(res => {
          setIsLogin(false);
        });
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
          <TwoFactorCode setIsLogin={setIsLogin}/>
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
          inputGame={inputGame}
          setInputGame={setInputGame}
        />
        {inputChat && <Chat />}
        {inputSettings && <Settings />}
        {inputGame && <Game />}
      </Box>
    );
  }
}
