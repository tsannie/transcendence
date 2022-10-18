import React from "react";
import TestProfile from "../../assets/quatennens.jpg";
import {ReactComponent as UploadIcon} from "../../assets/img/icon/up.svg";
import './settings.style.scss';

export default function SettingsPicture() {



  return (
    <div className="settings__picture">
      <img src={TestProfile} className="settings__picture__profile"></img>

      <label htmlFor="select-image" >
        <input
          accept="image/*"
          type="file"
          id="select-image"
        />
        <UploadIcon className="settings__picture__edit"/>
      </label>

    </div>
  );
}
