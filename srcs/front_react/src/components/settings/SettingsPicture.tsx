import React, { useContext, useEffect, useState } from "react";
import { toast, ToastContainer, ToastOptions } from "react-toastify";
import { ReactComponent as UploadIcon } from "../../assets/img/icon/up.svg";
import { api } from "../../const/const";
import { AuthContext, AuthContextType } from "../../contexts/AuthContext";

import "./settings.style.scss";

export default function SettingsPicture() {
  const { user } = useContext(AuthContext) as AuthContextType;

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
          toast.success("Avatar updated!");
        })
        .catch(() => {
          toast.error("Error while updating avatar");
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
