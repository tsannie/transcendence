import { Box } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { api, COOKIE_NAME } from "../../../const/const";
import { AuthContext, AuthContextType } from "../../../contexts/AuthContext";
import '../oauth/login.style.scss'
import TwoFactorCode from "./TwoFactorCode";


export default function TwoFactorPage(props: any) {

  const [is2FA, setIs2FA] = useState(true);
  const [isAlreadyLog, setIsAlreadyLog] = useState(false);

  const { isLogin } = useContext(AuthContext) as AuthContextType;

  useEffect(() => {
    if (document.cookie.includes(COOKIE_NAME)) {
      api.get('auth/profile').then(res => {
        setIsAlreadyLog(true);
      });

      api.get('auth/isTwoFactor').catch(() => {
        setIs2FA(false);
      });
    } else {
      setIs2FA(false);
    }
  }, []);

  if (isAlreadyLog === true || is2FA === false || isLogin === true)
    return <Navigate to="/" />

  return (
    <div className="login">
      <div className="login__fall">
        <h1>transcendence</h1>
      </div>
      <div className="loginBox">
        <TwoFactorCode/>
      </div>
    </div>

  );
}
