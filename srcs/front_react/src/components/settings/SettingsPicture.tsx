import React, { useContext, useEffect, useState } from "react";
import { toast, ToastContainer, ToastOptions } from "react-toastify";
import { ReactComponent as UploadIcon } from "../../assets/img/icon/up.svg";
import { api } from "../../const/const";
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

  const config_toast: ToastOptions = {
    position: "bottom-left",
    autoClose: 50000000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  };

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
          toast.success("Avatar updated!", config_toast);
        })
        .catch(() => {
          toast.error("Error while updating avatar", config_toast);
        });
    }
  };

  return (
    <div className="settings__picture">
      <img
        src={user?.profile_picture + "&size=large" + "&date=" + Date.now()}
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
