import { Button } from "@mui/material";
import React, { useState } from "react";
import { COOKIE_NAME } from "../../const";
import { api } from "../../userlist/UserListItem";
import ActivationProcess from "./ActivationProcess";


export default function Settings() {

  // request api on profile to set new state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [twoFactorA, setTwoFactorA] = useState(false);
  const [enable2FA, setEnable2FA] = useState(false);
  const [qrCode, setQrCode] = useState("");

  async function getQrCode() {     // TODO moove to ActivationProcess
    await api.get('2fa/generate' , {
      responseType: "arraybuffer"
    })
    .then((res) => {
      const base64 = btoa(
        new Uint8Array(res.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ''
        )
      )
      setQrCode(base64)
    })
  }
  async function getProfile() {
    await api.get('auth/profile').then(res => {
      setUsername(res.data.username);
      setEmail(res.data.email);
      console.log(res.data);
      setTwoFactorA(res.data.enabled2FA);
    })
  }

  async function activate2fa() {
    await getQrCode();
    setEnable2FA(true);
  }

  getProfile();

  return (
    <div>
      <h1>Profile</h1>

      <h2>Username</h2>
        <p>{username}</p>
      <h2>Email</h2>
        <p>{email}</p>
      <h2>Two Factor Authentication</h2>
        {!enable2FA &&
          <p>{twoFactorA ? "Enabled" : "Disabled"}</p>
        }
        {!twoFactorA && !enable2FA &&
          <Button variant="contained" onClick={activate2fa}>
            Enable
          </Button>
        }
        {enable2FA &&
          <ActivationProcess
            qrCode={qrCode}
          />
        }
    </div>
  );
}
