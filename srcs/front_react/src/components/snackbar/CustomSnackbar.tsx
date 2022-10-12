import { Snackbar } from '@mui/material';
import MuiAlert, { AlertColor, AlertProps } from '@mui/material/Alert';
import '../../app.style.scss';
import React from "react";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface IProps {
  setOpenSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
  openSnackbar: boolean;
  message: string;
  severity: AlertColor | undefined;
  afterReload: boolean;
}

export default function CustomSnackbar(props: IProps) {

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    props.setOpenSnackbar(false);
  }

  return (
  <Snackbar open={props.openSnackbar} autoHideDuration={2000} onClose={handleClose}>
    <Alert onClose={handleClose} severity={props.severity}>
      {props.message} !
    </Alert>
  </Snackbar>
  );
}
