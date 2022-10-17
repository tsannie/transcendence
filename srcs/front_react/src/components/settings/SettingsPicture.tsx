import React from "react";
import TestProfile from "../../assets/quatennens.jpg";
import EditIcon from "../../assets/img/icon/circle_chev_up.svg";
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
        <img src={EditIcon} className="settings__picture__edit"></img>
      </label>

    </div>
  );
}
