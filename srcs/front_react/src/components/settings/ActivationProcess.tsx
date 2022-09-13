import { Button, TextField } from "@mui/material";
import Snackbar from '@mui/material/Snackbar';
import React, { useEffect, useState } from "react";
import { api } from "../../userlist/UserListItem";
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function ActivationProcess(props: any) {
  const [token, setToken] = useState("");
  const [openError, setOpenError] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);

  async function checkToken() {
    await api.post('2fa/check-token', {
      token: token,
    }).then(res => {
      console.log('ACTTIVATE 2FA');
      setOpenSuccess(true);
      props.setTwoFactorA(true);
      props.setEnable2FA(false);
    }).catch(err => {
      console.log(err)
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
    setOpenSuccess(false);
  }

  return (
    <div>
      <h3>Scan the QR token with your authenticator app</h3>
      <img src={`data:;base64,${props.qrCode}`}></img>
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
      <Snackbar open={openSuccess} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          2FA successfully activated !
        </Alert>
      </Snackbar>
    </div>
  );
}


