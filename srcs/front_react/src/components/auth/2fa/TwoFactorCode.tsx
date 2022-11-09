import React, { useContext, useEffect, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ReactCodeInput from "react-verification-code-input";
import { api } from "../../../const/const";
import { AuthContext, AuthContextType } from "../../../contexts/AuthContext";

import "./twofactor.style.scss";

export default function TwoFactorCode() {
  const [check, setCheck] = useState<boolean>(false);

  const { login } = useContext(AuthContext) as AuthContextType;
  const nav = useNavigate();

  const inputRef = useRef<ReactCodeInput>(null);

  const clearInput = () => {
    if (inputRef.current) {
      inputRef.current?.__clearvalues__();
    }
  };

  const handleCancel = () => {
    api.get("/auth/logout").then((res) => {
      nav("/");
    });
  };

  const handleOnComplete = (up: string) => {
    setCheck(true);

    api
      .post("/2fa/auth2fa", { token: up })
      .then((res) => {
        login(res.data);
        toast.success("success login !");
      })
      .catch((res) => {
        clearInput();
        setCheck(false);
        toast.error("invalid token !");
      });
  };

  return (
    <div className="twoFactor">
      <h2>Validation Code</h2>
      <ReactCodeInput
        placeholder={["_", "_", "_", "_", "_", "_"]}
        disabled={check}
        className="authInput"
        onComplete={handleOnComplete}
        ref={inputRef}
      />
      <button onClick={handleCancel}>cancel</button>
    </div>
  );
}
