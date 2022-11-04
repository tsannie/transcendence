import React, {
  FormEvent,
  Fragment,
  KeyboardEvent,
  useContext,
  useState,
} from "react";
import { AuthContext, AuthContextType } from "../../contexts/AuthContext";
import { ReactComponent as EditIcon } from "../../assets/img/icon/edit.svg";
import { ReactComponent as VerifIcon } from "../../assets/img/icon/circle_check.svg";
import { api } from "../../const/const";
import {
  SnackbarContext,
  SnackbarContextType,
} from "../../contexts/SnackbarContext";

function EditUsername() {
  const { user, setReloadUser } = React.useContext(
    AuthContext
  ) as AuthContextType;
  const [editUsername, setEditUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const { setMessage, setOpenSnackbar, setSeverity } = useContext(
    SnackbarContext
  ) as SnackbarContextType;

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
        setNewUsername("");
        setSeverity("success");
        setMessage("username updated");
        setOpenSnackbar(true);
        setReloadUser(true);
        setEditUsername(false);
      })
      .catch((error) => {
        setSeverity("error");
        setMessage("'" + newUsername + "' is already use or invalid");
        setOpenSnackbar(true);
        setNewUsername("");
      });
  };

  const handleEnter = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      handleVerifyUsername();
    }
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
            onKeyDown={handleEnter}
          ></input>
          <VerifIcon onClick={handleVerifyUsername} />
        </Fragment>
      )}
      {editUsername === false && (
        <Fragment>
          <span>{user?.username}</span>
          <EditIcon onClick={handleUsername} />
        </Fragment>
      )}
    </div>
  );
}

export default EditUsername;
