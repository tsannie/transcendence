import { AxiosResponse } from "axios";
import React, { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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
    api.get("/auth/logout").then(() => {
      nav("/");
    });
  };

  const handleOnComplete = (up: string) => {
    setCheck(true);

    api
      .post("/2fa/auth2fa", { token: up })
      .then((res: AxiosResponse) => {
        login(res.data);
        toast.success("success login !");
      })
      .catch(() => {
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
