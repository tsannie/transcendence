import { AlertColor } from "@mui/material";
import React, { createContext, useState } from "react";
import CustomSnackbar from "../components/snackbar/CustomSnackbar";

export type SnackbarContextType = {
  openSnackbar: boolean;
  message: string;
  severity: AlertColor | undefined;
  setOpenSnackbar: (openSuccess: boolean) => void;
  setMessage: (message: string) => void;
  setSeverity: (severity: AlertColor | undefined) => void;
};

export const SnackbarContext = createContext<Partial<SnackbarContextType>>({});

interface IProps {
  children: JSX.Element | JSX.Element[];
}

export const SnackbarProvider = ({ children }: IProps) => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [severity, setSeverity] = useState("" as AlertColor | undefined);
  const [message, setMessage] = useState("");

  return (
    <SnackbarContext.Provider
      value={{ setOpenSnackbar, setMessage, setSeverity }}
    >
      {children}
      <CustomSnackbar
        setOpenSnackbar={setOpenSnackbar}
        openSnackbar={openSnackbar}
        message={message}
        severity={severity}
      />
    </SnackbarContext.Provider>
  );
};
