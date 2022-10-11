import React, { Fragment, useState } from 'react';
import { AuthContext, AuthContextType } from '../../contexts/AuthContext';
import EditIcon from "../../assets/img/icon/edit.png";
import VerifIcon from "../../assets/img/icon/verifier.png";
import { api } from '../../const/const';

function EditUsername(props: any) {
  const { user } = React.useContext(AuthContext) as AuthContextType;
  const [editUsername, setEditUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");


  const handleUsername = () => {
    setEditUsername(!editUsername);
  }

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const size_max = 20;

    setNewUsername(e.target.value.slice(0, size_max));
  }

  const handleVerifyUsername = () => {

    api.post('user/edit-username', {username: newUsername}).then(({ data }) => {
      console.log("data handleVerifyUsername", data);
    })
    .catch((error) => {
      console.log(error);
      props.setReasonError(newUsername + ' is already use or invalid');
      props.setOpenError(true);
    });
  }

  return (
    <div className="settings__editable">
    { editUsername === true &&
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
    }
    { editUsername === false &&
      <Fragment>
        <span>{user?.username}</span>
        <img src={EditIcon} onClick={handleUsername}></img>
      </Fragment>
    }
  </div>
  );
}

export default EditUsername;
