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
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(true);

  async function checkToken() {
    await api.post('2fa/check-token', {
      token: token,
    }).then(res => {
      console.log(res.data)
      setSuccess(true)
    }).catch(err => {
      console.log(err)
      setSuccess(false)
    })
  }
  const handleClick = () => {
    checkToken();
    setOpen(true);
  };

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    console.log(success)
    if (success === false) {
      return;
    }

    setOpen(false);
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
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          This is a success message!
        </Alert>
      </Snackbar>
    </div>
  );
}


