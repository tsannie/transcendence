import { Button, TextField } from "@mui/material";
import Snackbar from '@mui/material/Snackbar';
import React, { useEffect, useState } from "react";
import { api } from "../../userlist/UserListItem";
import { Alert } from "./Settings";
import { Buffer } from 'buffer';


export default function ActivationProcess(props: any) {
  const [token, setToken] = useState("");
  const [openError, setOpenError] = useState(false);
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
      setOpenError(true);
    })
  }
  const handleClick = () => {
    checkToken();
  };

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenError(false);
  }

  useEffect(() => {
    getQrCode();
  }, []);

  return (
    <div>
      <h3>Scan the QR token with your authenticator app</h3>
      <img src={`data:;base64,${qrCode}`}></img>
      <h3>Enter the token from your app</h3>

      <TextField id="standard-basic" label="Validation code" variant="standard"
        type="number" value={token} onChange={(e) => setToken(e.target.value)}>
      </TextField>

      <Button variant="contained" onClick={handleClick}>
        Validate
      </Button>

      <Snackbar open={openError} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          Invalid activation code !
        </Alert>
      </Snackbar>
    </div>
  );
}


