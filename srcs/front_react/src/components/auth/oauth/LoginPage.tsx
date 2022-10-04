import { Box } from "@mui/material";
import React, { useEffect } from "react";
import ButtonLogin from "./ButtonLogin";
import './login.style.scss'


export default function LoginPage(props: any) {

  return (
    <div className="login">
      <div className="login__fall">
        <h1>transcendence</h1>
      </div>
      <div className="loginBox">
        <ButtonLogin isLogin={props.isLogin} setIsLogin={props.setIsLogin} />
      </div>
    </div>

  );
}
