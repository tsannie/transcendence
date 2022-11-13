import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import { toast, ToastContainer, ToastOptions } from "react-toastify";
import { ReactComponent as UploadIcon } from "../../assets/img/icon/up.svg";
import { api } from "../../const/const";
import { AuthContext, AuthContextType } from "../../contexts/AuthContext";

import "./settings.style.scss";

export default function SettingsPicture() {
  const { user } = useContext(AuthContext) as AuthContextType;

  const [picture, setPicture] = useState<string | undefined>(
    user?.profile_picture
  );

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
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
          setPicture(user?.profile_picture + "&?date=" + Date.now());
        })
        .catch(() => {
          toast.error("Error while updating avatar");
        });
    }
  };

  return (
    <div className="settings__picture">
      <img src={picture} className="settings__picture__profile"></img>
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
