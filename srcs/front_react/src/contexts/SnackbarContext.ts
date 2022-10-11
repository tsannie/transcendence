import React, { useState } from "react";
import ErrorSnackbar from "../components/snackbar/ErrorSnackbar";
import SuccessSnackbar from "../components/snackbar/SuccessSnackbar";

export type SnackbarContextType = {
  openError: boolean;
  setOpenError: (openError: boolean) => void;
  openSuccess: boolean;
  setOpenSuccess: (openSuccess: boolean) => void;
  reason: string;
  setReason: (reason: string) => void;
}

export const SnackbarContext = React.createContext<Partial<SnackbarContextType>>({});

interface IProps {
  children: JSX.Element | JSX.Element[];
}

export const SnackbarProvider = ({ children }: IProps) => {

  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [reason, setReason] = useState("");

  const login = (user: User) => {
    setIsLogin(true);
    setUser(user);
  }

  const logout = () => {
    setIsLogin(false);
    setUser(null);
  }


  return (

    <AuthContext.Provider value={{ isLogin, user, login, logout, setOpenError, setOpenSuccess, setReason }}>
      {children}
      <SuccessSnackbar/>
      <ErrorSnackbar
        openError={openError}
        setOpenError={setOpenError}
        reason={reason}
      />
    </AuthContext.Provider>
  );

}
