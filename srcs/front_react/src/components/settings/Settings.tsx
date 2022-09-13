import { Button, Snackbar } from "@mui/material";
import React, { useEffect, useState } from "react";
import { COOKIE_NAME } from "../../const";
import { api } from "../../userlist/UserListItem";
import ActivationProcess from "./ActivationProcess";
import MuiAlert, { AlertProps } from '@mui/material/Alert';

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Settings() {

  // request api on profile to set new state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [twoFactorA, setTwoFactorA] = useState(false);
  const [enable2FA, setEnable2FA] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);


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

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSuccess(false);
  }

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <div>
      {/* Display profile information */}
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
        {/* 2FA activatione process */}
        {enable2FA &&
          <ActivationProcess
            setTwoFactorA={setTwoFactorA}
            setEnable2FA={setEnable2FA}
            setOpenSuccess={setOpenSuccess}
          />
        }
      {/* Activation 2FA success message */}
      <Snackbar open={openSuccess} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          2FA successfully activated !
        </Alert>
      </Snackbar>
    </div>
  );
}
