import React, { useContext, useEffect, useState } from "react";
import {ReactComponent as UploadIcon} from "../../assets/img/icon/up.svg";
import TestProfile from "../../assets/quatennens.jpg";
import { api } from "../../const/const";
import { Buffer } from "buffer";
import { AuthContext, AuthContextType } from "../../contexts/AuthContext";
import { SnackbarContext, SnackbarContextType } from "../../contexts/SnackbarContext";

import './settings.style.scss';

export default function SettingsPicture() {

  const { user } = useContext(AuthContext) as AuthContextType;
  const { setMessage, setOpenSnackbar, setSeverity, setAfterReload } =
    useContext(SnackbarContext) as SnackbarContextType;

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const config = {
        headers: {
          "content-type": "multipart/form-data"
        }
      };
      api.post('/user/addAvatar', {avatar: e.target.files[0]}, config).then((res) => {
        setSeverity("success");
        setMessage("Avatar updated");
        setAfterReload(true);
        window.location.reload();
      }).catch((err) => {
        setSeverity("error");
        setMessage("Error while uploading avatar");
        setOpenSnackbar(true);
      });
    }
  }

  return (
    <div className="settings__picture">
      <img src={user?.profile_picture} className="settings__picture__profile"></img>
      <label htmlFor="select-image" >
        <input
          accept="image/jpg image/jpeg image/png"
          type="file"
          onChange={handleUpload}
          id="select-image"
        />
        <UploadIcon className="settings__picture__edit"/>
      </label>
    </div>
  );
}
