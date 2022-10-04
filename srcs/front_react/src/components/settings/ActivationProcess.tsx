import { Button, TextField } from "@mui/material";
import Snackbar from '@mui/material/Snackbar';
import React, { useEffect, useState } from "react";
import { Buffer } from 'buffer';
import { api } from "../../const/const";


export default function ActivationProcess(props: any) {
  const [token, setToken] = useState("");
  const [qrCode, setQrCode] = useState("");

  async function getQrCode() {
    await api.get('2fa/generate' , {
      responseType: "arraybuffer"
    })
    .then((res) => {
      const base64 = Buffer.from(res.data, 'utf8').toString('base64');
      setQrCode(base64);
    })
  }

  async function checkToken() {
    await api.post('2fa/check-token', {
      token: token,
    }).then(res => {
      props.setOpenSuccess(true);
      props.setTwoFactorA(true);
      props.setEnable2FA(false);
    }).catch(err => {
      props.setOpenError(true);
      setToken('');
    })
  }
  const handleClick = () => {
    checkToken();
  };

  useEffect(() => {
    getQrCode();
  }, []);

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const size_max = 6;

    setToken(e.target.value.slice(0, size_max));
  }

  return (
    <div>
      <h2>Scan the QR token with your auth app</h2>
      <img src={`data:;base64,${qrCode}`}></img>
      <h2>Enter the token from your app</h2>
      <div className="settings__2fa__validation">
        <input
          id="token"
          maxLength={6}
          type="number"
          value={token}
          onChange={handleTokenChange}
        ></input>
        <button onClick={handleClick}>Validate</button>
      </div>
    </div>
  );
}