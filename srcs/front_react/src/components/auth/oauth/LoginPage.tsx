import { AxiosError } from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { api, COOKIE_NAME } from "../../../const/const";
import ButtonLogin from "./ButtonLogin";
import "./login.style.scss";

export default function LoginPage() {
  const [is2FA, setIs2FA] = useState<boolean>(false);
  const [isAlreadyLog, setIsAlreadyLog] = useState<boolean>(false);

  useEffect(() => {
    if (document.cookie.includes(COOKIE_NAME)) {
      api
        .get("auth/profile")
        .then(() => {
          setIsAlreadyLog(true);
        })
        .catch((err: AxiosError) => {
          return console.log(err);
        });

      api
        .get("auth/isTwoFactor")
        .then(() => {
          setIs2FA(true);
        })
        .catch((err: AxiosError) => {
          return console.log(err);
        });
    }
  }, []);

  if (is2FA === true) return <Navigate to="/2fa" />;
  else if (isAlreadyLog === true) return <Navigate to="/" />;

  return (
    <div className="login">
      <div className="login__fall">
        <h1>transcendence</h1>
      </div>
      <div className="loginBox">
        <div className="loginBox__bg"></div>
        <ButtonLogin />
      </div>
    </div>
  );
}
