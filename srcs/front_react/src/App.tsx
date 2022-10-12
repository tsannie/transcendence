import {
  Box, Grid
} from "@mui/material";

import React, { useEffect, useState } from "react";

import ButtonLogin from "./Auth/ButtonLogin";
import Chat from "./components/chat/Chat";
import Sidebar from "./components/sidebar/Sidebar";
import LogoIcon from "./assets/logo-project.png";
import Settings from "./components/settings/Settings";
import TwoFactorCode from "./Auth/TwoFactorCode";
import { api, COOKIE_NAME } from "./const/const";
import { SocketProvider } from "./contexts/SocketContext";
import { ChannelsProvider } from "./contexts/ChannelsContext";

export default function App() {
  const [inputChat, setInputChat] = useState(false);
  const [inputSettings, setInputSettings] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [is2FA, setIs2FA] = useState(false);

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
      <SocketProvider>
        <Grid
          container
        >
          <Grid item >
          <Sidebar
            setInputChat={setInputChat}
            setInputSettings={setInputSettings}
            setIsLogin={setIsLogin}
            setIs2FA={setIs2FA}
          />
          </Grid>
            <Grid item xs={11} sx={{
              ml: "72px",
            }}>
              {inputChat && <Chat />}
              {inputSettings && <Settings />}
            </Grid>
        </Grid>
    </SocketProvider>
    );
  }
}
