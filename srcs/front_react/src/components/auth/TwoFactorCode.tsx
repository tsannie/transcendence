import React from "react";
import ReactCodeInput from "react-verification-code-input";
import { api } from "../../const/const";
import InvalidSnackbar from "./InvalidSnackbar";
import './twofactor.style.scss'

export default function TwoFactorCode(props: any) {
  const [check, setCheck] = React.useState(false);
  const [openError, setOpenError] = React.useState(false);

  const inputRef = React.useRef<ReactCodeInput>(null);

  const clearInput = () => {
    if (inputRef.current) {
      inputRef.current?.__clearvalues__();
    }
  }

  const handleOnComplete = (up: string) => {
    setCheck(true);
    console.log('up', up);

    api.post("/2fa/auth2fa", { token: up }).then((res) => {
      console.log('connected');
      props.setIsLogin(true);
    }).catch((res) => {
      console.log('invalid token');
      clearInput();
      setCheck(false);
      setOpenError(true);
    });
  };

  //TODO add cancel button

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
      <InvalidSnackbar openError={openError} setOpenError={setOpenError}/>
    </div>
  );
}
