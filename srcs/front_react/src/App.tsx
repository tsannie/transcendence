import React, { useEffect, useState } from "react";
import Chat from "./components/chat/Chat";
import Sidebar from "./components/sidebar/Sidebar";
import LogoIcon from "./assets/logo-project.png";
import Settings from "./components/settings/Settings";
import ButtonLogin from "./components/auth/ButtonLogin";
import TwoFactorCode from "./components/auth/TwoFactorCode";
import LoginPage from "./components/auth/LoginPage";
import { api, COOKIE_NAME } from "./const/const";
import Menu from "./components/menu/Menu";
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
        { isLogin === false &&
          <LoginPage setIsLogin={setIsLogin}
            is2FA={is2FA}
            isLogin={isLogin}
          />
        }
        {
          isLogin === true &&
          <Menu/>
        }
      <div className="bg">
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
}


