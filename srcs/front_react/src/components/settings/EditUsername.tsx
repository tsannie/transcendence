import React, {
  ChangeEvent,
  FormEvent,
  Fragment,
  KeyboardEvent,
  MouseEvent,
  useContext,
  useState,
} from "react";
import { AuthContext, AuthContextType } from "../../contexts/AuthContext";
import { ReactComponent as EditIcon } from "../../assets/img/icon/edit.svg";
import { ReactComponent as VerifIcon } from "../../assets/img/icon/circle_check.svg";
import { api } from "../../const/const";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

function EditUsername() {
  const { user, setReloadUser } = React.useContext(
    AuthContext
  ) as AuthContextType;
  const [editUsername, setEditUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");

  const handleUsername = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setEditUsername(!editUsername);
  };

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const size_max = 20;

    setNewUsername(e.target.value.slice(0, size_max));
  };

  const handleVerifyUsername = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    api
      .post("user/edit-username", { username: newUsername })
      .then(() => {
        setNewUsername("");
        toast.success("username changed !");
        setReloadUser(true);
        setEditUsername(false);
      })
      .catch((error: AxiosError) => {
        if (error.response?.status === 422)
          toast.error("'" + newUsername + "' is already taken !");
        else toast.error("'" + newUsername + "' is invalid !");

        setNewUsername("");
      });
  };

  return (
    <div className="settings__editable">
      {editUsername === true && (
        <Fragment>
          <form onSubmit={handleVerifyUsername}>
            <input
              id="username"
              maxLength={20}
              type="text"
              value={newUsername}
              onChange={handleUsernameChange}
            />
            <button type="submit">
              <VerifIcon />
            </button>
          </form>
        </Fragment>
      )}
      {editUsername === false && (
        <Fragment>
          <span>{user?.username}</span>
          <button onClick={handleUsername}>
            <EditIcon />
          </button>
        </Fragment>
      )}
    </div>
  );
}

export default EditUsername;
