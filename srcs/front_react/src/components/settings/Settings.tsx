import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import ActivationProcess from "./ActivationProcess";
import Success2FASnackbar from "./snackbar/Success2FASnackbar";
import Error2FASnackbar from "./snackbar/Error2FASnackbar";
import { api } from "../../const/const";
import './settings.style.scss';

export default function Settings() {

  // request api on profile to set new state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [twoFactorA, setTwoFactorA] = useState(false);
  const [enable2FA, setEnable2FA] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);


  async function getProfile() {
    await api.get('auth/profile').then(res => {
      console.log(res.data);
      setUsername(res.data.username);
      setEmail(res.data.email);
      setTwoFactorA(res.data.enabled2FA);
    })
  }

  async function activate2fa() {
    setEnable2FA(true);
  }

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <div className="settings">
      {/* Display profile information */}
      <h1>Profile</h1>
      <h2>Username</h2>
        <p>{username}</p>
      <h2>Email</h2>
        <p>{email}</p>

      <h2>Two Factor Authentication (2FA)</h2>
        {!enable2FA &&
          <p>{twoFactorA ? "Enabled" : "Disabled"}</p>
        }
        {!twoFactorA && !enable2FA &&
          <button onClick={activate2fa}>
            Activate 2FA
          </button>
        }
        {/* 2FA activatione process */}
        {enable2FA &&
          <ActivationProcess
            setTwoFactorA={setTwoFactorA}
            setEnable2FA={setEnable2FA}
            setOpenSuccess={setOpenSuccess}
            setOpenError={setOpenError}
          />
        }

        <Success2FASnackbar openSuccess={openSuccess} setOpenSuccess={setOpenSuccess}/>
        <Error2FASnackbar openError={openError} setOpenError={setOpenError}/>

    </div>
  );
}
