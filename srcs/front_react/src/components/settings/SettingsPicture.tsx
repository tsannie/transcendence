import React, { useContext, useEffect, useState } from "react";
import { ReactComponent as UploadIcon } from "../../assets/img/icon/up.svg";
import TestProfile from "../../assets/quatennens.jpg";
import { api } from "../../const/const";
import { Buffer } from "buffer";
import { AuthContext, AuthContextType } from "../../contexts/AuthContext";
import {
  SnackbarContext,
  SnackbarContextType,
} from "../../contexts/SnackbarContext";

import "./settings.style.scss";

export default function SettingsPicture() {
  const { user } = useContext(AuthContext) as AuthContextType;
  const { setMessage, setOpenSnackbar, setSeverity } = useContext(
    SnackbarContext
  ) as SnackbarContextType;

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };
      api
        .post("/user/addAvatar", { avatar: e.target.files[0] }, config)
        .then(() => {
          setSeverity("success");
          setMessage("Avatar updated");
          setOpenSnackbar(true);
        })
        .catch(() => {
          setSeverity("error");
          setMessage("Error while uploading avatar");
          setOpenSnackbar(true);
        });
    }
  };

  return (
    <div className="settings__picture">
      <img
        key={Date.now()}
        src={user?.profile_picture + "&size=medium"}
        className="settings__picture__profile"
      ></img>
      <label htmlFor="select-image">
        <input
          accept="image/jpg image/jpeg image/png"
          type="file"
          onChange={handleUpload}
          id="select-image"
        />
        <UploadIcon className="settings__picture__edit" />
      </label>
    </div>
  );
}
