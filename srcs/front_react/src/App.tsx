import {
  Box
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Chat from "./components/chat/Chat";
import Sidebar from "./components/sidebar/Sidebar";
import LogoIcon from "./assets/logo-project.png";
import Settings from "./components/settings/Settings";
import ButtonLogin from "./components/auth/ButtonLogin";
import TwoFactorCode from "./components/auth/TwoFactorCode";
import LoginPage from "./components/auth/LoginPage";
import { api, COOKIE_NAME } from "./const/const";

import './app.style.scss'

export default function App() {
  const [inputChat, setInputChat] = useState(false);
  const [inputSettings, setInputSettings] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [is2FA, setIs2FA] = useState(false);

  useEffect(() => {
    console.log('hello')
    if (document.cookie.includes(COOKIE_NAME)) {
      api.get('auth/isTwoFactor').then(res => {
        setIs2FA(res.data.isTwoFactor);
      }).catch(res => {
        console.log('invalid jwt');
        document.cookie = COOKIE_NAME + '=; Max-Age=-1;;';  // TODO call logout api
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

  return (
    <div className="app">
      <div className="bg">
        { isLogin === false &&
          <LoginPage setIsLogin={setIsLogin}
            is2FA={is2FA}
            isLogin={isLogin}
          />
        }
        <div className="ball"></div>
        <div className="ball"></div>
        <div className="ball"></div>
        <div className="ball"></div>
        <div className="ball"></div>
        <div className="ball"></div>
        <div className="ball"></div>
        <div className="ball"></div>
        <div className="ball"></div>
        <div className="ball"></div>
      </div>
    </div>
  );

  /*{isLogin === false &&
    <LoginPage setIsLogin={setIsLogin}
      is2FA={is2FA}
      isLogin={isLogin}
    />
  }*/

  /*if (!isLogin) {
    return (
      <Box sx={{
        bgcolor: "rgba(0, 0, 0, 0.70)",
        height: "100vh",
        pt: "2vh",
      }}>
      <Auth setIsLogin={setIsLogin} is2FA={is2FA} setIs2FA={setIs2FA}/>
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
  }*/

  /*else {
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
  }*/
}
