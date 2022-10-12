import { AlertColor } from "@mui/material";
import React, { createContext, useEffect, useState } from "react";
import CustomSnackbar from "../components/snackbar/CustomSnackbar";

export type SnackbarContextType = {
  openSnackbar: boolean;
  message: string;
  severity: AlertColor | undefined;
  reloadAfter: boolean;
  setOpenSnackbar: (openSuccess: boolean) => void;
  setMessage: (message: string) => void;
  setSeverity: (severity: AlertColor | undefined) => void;
  setReloadAfter: (reloadAfter: boolean) => void;
};

export const SnackbarContext = createContext<Partial<SnackbarContextType>>({});

interface IProps {
  children: JSX.Element | JSX.Element[];
}

export const SnackbarProvider = ({ children }: IProps) => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [reloadAfter, setReloadAfter] = useState(false);
  const [severity, setSeverity] = useState("" as AlertColor | undefined);
  const [message, setMessage] = useState("");


  useEffect(() => {
    if (reloadAfter === true) {
      localStorage.setItem('severityKey', JSON.stringify(severity));
      localStorage.setItem('messageKey', JSON.stringify(message));
      window.location.reload();
    }
  }, [reloadAfter]);

  useEffect(() => {
    if (localStorage.messageKey && localStorage.severityKey) {
      setSeverity(JSON.parse(localStorage.getItem('severityKey') || ''));
      setMessage(JSON.parse(localStorage.getItem('messageKey') || ''));
      setOpenSnackbar(true);
      localStorage.clear();
    }
  }, []);

  return (
    <SnackbarContext.Provider
      value={{ setOpenSnackbar, setMessage, setSeverity, setReloadAfter }}
    >
      {children}
      <CustomSnackbar
        setOpenSnackbar={setOpenSnackbar}
        openSnackbar={openSnackbar}
        message={message}
        severity={severity}
        reloadAfter={reloadAfter}
      />
    </SnackbarContext.Provider>
  );
};
