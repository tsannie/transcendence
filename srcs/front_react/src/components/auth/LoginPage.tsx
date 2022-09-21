import { Box } from "@mui/material";
import React, { useEffect } from "react";
import ButtonLogin from "./ButtonLogin";
import TwoFactorCode from "./TwoFactorCode";
import LogoIcon from "../../assets/logo-project.png";
import './login.style.scss'


export default function LoginPage(props: any) {

  return (
    <div className="login">
    <img src={LogoIcon}></img>
      {!props.is2FA &&
        <ButtonLogin isLogin={props.isLogin} setIsLogin={props.setIsLogin} />
      }
      {props.is2FA &&
        <TwoFactorCode setIsLogin={props.setIsLogin}/>
      }
    </div>
  );
}
