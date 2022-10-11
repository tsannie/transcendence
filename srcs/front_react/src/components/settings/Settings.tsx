import { Button } from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import ActivationProcess from "./ActivationProcess";
import Success2FASnackbar from "./snackbar/Success2FASnackbar";
import Error2FASnackbar from "./snackbar/Error2FASnackbar";
import { api } from "../../const/const";
import "./settings.style.scss";
import SettingsPicture from "./SettingsPicture";
import { AuthContext, AuthContextType } from "../../contexts/AuthContext";
import EditUsername from "./EditUsername";

export default function Settings() {
  // request api on profile to set new state
  const [enable2FA, setEnable2FA] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [reasonError, setReasonError] = useState("");
  const [openError, setOpenError] = useState(false);

  const { user } = React.useContext(AuthContext) as AuthContextType;

  async function activate2fa() {
    setEnable2FA(true);
  }

  return (
    <div className="settings">
      {/* Display profile information */}
      <div className="settings__title">
        <h1>Settings</h1>
        <SettingsPicture />
      </div>
      <h2>Username</h2>
      <EditUsername
        setOpenError={setOpenError}
        setReasonError={setReasonError}
      />
      <h2>Email</h2>
      <span>{user?.email}</span>
      <h2>Two Factor Authentication (2FA)</h2>
      {!enable2FA && <span>{user?.enabled2FA ? "Enabled" : "Disabled"}</span>}
      {!user?.enabled2FA && !enable2FA && (
        <button onClick={activate2fa}>Activate 2FA</button>
      )}
      {/* 2FA activatione process */}
      {enable2FA && (
        <ActivationProcess
          setEnable2FA={setEnable2FA}
          setOpenSuccess={setOpenSuccess}
          setOpenError={setOpenError}
        />
      )}

      <Success2FASnackbar
        openSuccess={openSuccess}
        setOpenSuccess={setOpenSuccess}
      />
      <Error2FASnackbar
        openError={openError}
        setOpenError={setOpenError}
        reasonError={reasonError}
      />
    </div>
  );
}
