import { useContext, useState } from "react";
import { AuthContext, AuthContextType } from "../../contexts/AuthContext";
import ActivationProcess from "./ActivationProcess";
import EditUsername from "./EditUsername";
import "./settings.style.scss";
import SettingsPicture from "./SettingsPicture";

export default function Settings() {
  // request api on profile to set new state
  const [enable2FA, setEnable2FA] = useState(false);

  const { user } = useContext(AuthContext) as AuthContextType;

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
      <EditUsername />
      <h2>Email</h2>
      <span>{user?.email}</span>
      <h2>Two Factor Authentication (2FA)</h2>
      {!enable2FA && <span>{user?.enabled2FA ? "Enabled" : "Disabled"}</span>}
      {!user?.enabled2FA && !enable2FA && (
        <button onClick={activate2fa}>Activate 2FA</button>
      )}
      {/* 2FA activatione process */}
      {enable2FA && <ActivationProcess />}
    </div>
  );
}
