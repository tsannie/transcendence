import React, { useEffect, useState } from "react";
import { api, COOKIE_NAME } from "./const/const";
import Menu from "./components/menu/Menu";
import './app.style.scss'
import { Route, Router, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Switch } from "@mui/material";
import LoginPage from "./components/auth/oauth/LoginPage";
import TwoFactorPage from "./components/auth/2fa/TwoFactorPage";
import { PrivateRoute } from "./components/routes/PrivateComponent";

export default function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [is2FA, setIs2FA] = useState(false);

  useEffect(() => {
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

  //<AuthProvider>

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<PrivateRoute component={Menu} />}/>
        <Route path="/auth" element={<LoginPage />} />
        <Route path="/2fa" element={<TwoFactorPage/>} />
      </Routes>




        {/* { isLogin === false &&
          <LoginPage setIsLogin={setIsLogin}
            is2FA={is2FA}
            isLogin={isLogin}
          />
        }
        {
          isLogin === true &&
          <Menu/>
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
      </div> */}
    </div>
  );
}


