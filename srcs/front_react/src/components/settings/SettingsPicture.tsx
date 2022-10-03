import React from "react";
import TestProfile from "../../assets/quatennens.png";
import './settings.style.scss';

export default function SettingsPicture() {
  return (
    <div className="settings__picture">
      <img src={TestProfile}></img>
    </div>
  );
}
