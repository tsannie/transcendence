import { Box } from "@mui/material";
import React, { useEffect } from "react";
import '../oauth/login.style.scss'
import TwoFactorCode from "./TwoFactorCode";


export default function TwoFactorPage(props: any) {

  // TODO edit effect apparition
  return (
    <div className="login">
      <div className="login__fall">
        <h1>transcendence</h1>
      </div>
      <div className="loginBox">
        <TwoFactorCode isLogin={props.isLogin} setIsLogin={props.setIsLogin} />
      </div>
    </div>

  );
}
