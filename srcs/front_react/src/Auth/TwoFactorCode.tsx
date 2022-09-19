import React from "react";
import ReactCodeInput from "react-verification-code-input";
import './twofactor.style.scss'

export default function TwoFactorCode() {
  const [token, setToken] = React.useState("");

  const handleOnChange = (up: string) => {
    setToken(up);
    console.log(up);
  };

  const handleOnComplete = () => {

    console.log("complete");
  };

  return (
    <div>
      <h1>Validation Code</h1>
      <ReactCodeInput
        className='authInput'
        onChange={handleOnChange}
        onComplete={handleOnComplete}
      />
    </div>
  );
}
