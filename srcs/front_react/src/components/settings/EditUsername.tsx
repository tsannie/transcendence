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
import { toast } from "react-toastify";

function EditUsername() {
  const { user, setReloadUser } = React.useContext(
    AuthContext
  ) as AuthContextType;
  const [editUsername, setEditUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");

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
        toast.success("username changed !");
        setReloadUser(true);
        setEditUsername(false);
      })
      .catch((error) => {
        if (error.response.status === 422)
          toast.error("'" + newUsername + "' is already taken !");
        else toast.error("'" + newUsername + "' is invalid !");

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
