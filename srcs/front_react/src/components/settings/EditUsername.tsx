import React, { Fragment, useContext, useState } from "react";
import { AuthContext, AuthContextType } from "../../contexts/AuthContext";
import EditIcon from "../../assets/img/icon/edit.svg";
import VerifIcon from "../../assets/img/icon/circle_check.svg";
import { api } from "../../const/const";
import {
  SnackbarContext,
  SnackbarContextType,
} from "../../contexts/SnackbarContext";

function EditUsername() {
  const { user } = React.useContext(AuthContext) as AuthContextType;
  const [editUsername, setEditUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const { setMessage, setOpenSnackbar, setSeverity, setAfterReload } =
    useContext(SnackbarContext) as SnackbarContextType;

  const handleUsername = () => {
    setEditUsername(!editUsername);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const size_max = 20;

    setNewUsername(e.target.value.slice(0, size_max));
  };

  const handleVerifyUsername = () => {
    api
      .post("user/edit-username", { username: newUsername })
      .then(({ data }) => {
        setSeverity("success");
        setMessage("username updated");
        setAfterReload(true);
        window.location.reload();
      })
      .catch((error) => {
        setSeverity("error");
        setMessage("'" + newUsername + "' is already use or invalid");
        setOpenSnackbar(true);
        setNewUsername("");
      });
  };

  return (
    <div className="settings__editable">
      {editUsername === true && (
        <Fragment>
          <input
            id="username"
            maxLength={20}
            type="text"
            value={newUsername}
            onChange={handleUsernameChange}
          ></input>
          <img src={VerifIcon} onClick={handleVerifyUsername}></img>
        </Fragment>
      )}
      {editUsername === false && (
        <Fragment>
          <span>{user?.username}</span>
          <img src={EditIcon} onClick={handleUsername}></img>
        </Fragment>
      )}
    </div>
  );
}

export default EditUsername;
