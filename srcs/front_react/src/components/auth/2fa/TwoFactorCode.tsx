import React, { useContext, useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import ReactCodeInput from "react-verification-code-input";
import { api } from "../../../const/const";
import { AuthContext, AuthContextType } from "../../../contexts/AuthContext";
import { SnackbarContext, SnackbarContextType } from "../../../contexts/SnackbarContext";
import './twofactor.style.scss'


export default function TwoFactorCode() {
  const [check, setCheck] = useState(false);

  const { login } = useContext(AuthContext) as AuthContextType;

  const { setMessage, setOpenSnackbar, setSeverity, setAfterReload } =
  useContext(SnackbarContext) as SnackbarContextType;


  const inputRef = useRef<ReactCodeInput>(null);


  const clearInput = () => {
    if (inputRef.current) {
      inputRef.current?.__clearvalues__();
    }
  }

  const handleCancel = () => {
    api.get('/auth/logout')
    .then(res => {
      window.location.reload();
    });
  }


  const handleOnComplete = (up: string) => {
    setCheck(true);

    api.post("/2fa/auth2fa", { token: up }).then((res) => {
      login(res.data);
      setSeverity("success");
      setMessage("success login");
      setOpenSnackbar(true);
    }).catch((res) => {
      clearInput();
      setCheck(false);
      setSeverity("error");
      setMessage("invalid token");
      setOpenSnackbar(true);
    });
  };

  return (
    <div className="twoFactor">
      <h2>Validation Code</h2>
      <ReactCodeInput
        placeholder={["_", "_", "_", "_", "_", "_"]}
        disabled={check}
        className='authInput'
        onComplete={handleOnComplete}
        ref={inputRef}
      />
      <button onClick={handleCancel} >cancel</button>
    </div>
  );
}
