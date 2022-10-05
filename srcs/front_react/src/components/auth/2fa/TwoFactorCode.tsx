import React, { useContext, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import ReactCodeInput from "react-verification-code-input";
import { api } from "../../../const/const";
import { AuthContext, AuthContextType } from "../../../contexts/AuthContext";
import InvalidSnackbar from "./InvalidSnackbar";
import './twofactor.style.scss'


export default function TwoFactorCode() {
  const [check, setCheck] = useState(false);
  const [openError, setOpenError] = useState(false);

  const { login, isLogin } = useContext(AuthContext) as AuthContextType;

  const inputRef = useRef<ReactCodeInput>(null);


  const clearInput = () => {
    if (inputRef.current) {
      inputRef.current?.__clearvalues__();
    }
  }

  const handleCancel = () => {
    // TODO logout route
  }


  const handleOnComplete = (up: string) => {
    setCheck(true);
    console.log('up', up);

    api.post("/2fa/auth2fa", { token: up }).then((res) => {
      login(res.data);
    }).catch((res) => {
      console.log('invalid token');
      clearInput();
      setCheck(false);
      setOpenError(true);
    });
  };

  if (isLogin === true)
    return <Navigate to="/" />

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
      <InvalidSnackbar openError={openError} setOpenError={setOpenError}/>
    </div>
  );
}
