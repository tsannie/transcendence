import { Box } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { api, COOKIE_NAME } from "../../../const/const";
import { TransitionContext, TransitionContextType } from "../../../contexts/TransitionContext";
import ButtonLogin from "./ButtonLogin";
import './login.style.scss'

export default function LoginPage() {
  const [is2FA, setIs2FA] = useState(false);
  const [isAlreadyLog, setIsAlreadyLog] = useState(false);

  useEffect(() => {
    if (document.cookie.includes(COOKIE_NAME)) {
      api.get('auth/profile').then(() => {
        setIsAlreadyLog(true);
      });

      api.get('auth/isTwoFactor').then(() => {
        setIs2FA(true);
      });
    }
  }, []);


  if (is2FA === true)
    return <Navigate to="/2fa" />
  else if (isAlreadyLog === true)
    return <Navigate to="/" />

  return (
    <div className="login">
      <div className="login__fall">
        <h1>transcendence</h1>
      </div>
      <div className="loginBox">
        <ButtonLogin />
      </div>
    </div>

  );
}
