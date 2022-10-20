import { AlertColor } from "@mui/material";
import React, { createContext, useEffect, useState } from "react";
import CustomSnackbar from "../components/snackbar/CustomSnackbar";

export type SnackbarContextType = {
  openSnackbar: boolean;
  message: string;
  severity: AlertColor | undefined;
  afterReload: boolean;
  setOpenSnackbar: (openSuccess: boolean) => void;
  setMessage: (message: string) => void;
  setSeverity: (severity: AlertColor | undefined) => void;
  setAfterReload: (afterReload: boolean) => void;
};

export const SnackbarContext = createContext<Partial<SnackbarContextType>>({});

interface IProps {
  children: JSX.Element | JSX.Element[];
}

export const SnackbarProvider = ({ children }: IProps) => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [afterReload, setAfterReload] = useState(false);
  const [severity, setSeverity] = useState("" as AlertColor | undefined);
  const [message, setMessage] = useState("");


  useEffect(() => {
    if (afterReload === true) {
      localStorage.setItem('severityKey', JSON.stringify(severity));
      localStorage.setItem('messageKey', JSON.stringify(message));
    }
  }, [afterReload]);

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
      value={{ setOpenSnackbar, setMessage, setSeverity, setAfterReload }}
    >
      {children}
      <CustomSnackbar
        setOpenSnackbar={setOpenSnackbar}
        openSnackbar={openSnackbar}
        message={message}
        severity={severity}
        afterReload={afterReload}
      />
    </SnackbarContext.Provider>
  );
};
