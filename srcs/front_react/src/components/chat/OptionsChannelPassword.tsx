import {
  ChangeEvent,
  Fragment,
  useContext,
  useState,
} from "react";
import { toast } from "react-toastify";
import { api } from "../../const/const";
import { AuthContext, User } from "../../contexts/AuthContext";
import { IChannel } from "./types";
import { ReactComponent as DeleteIcon } from "../../assets/img/icon/circle_remove.svg";
import { ReactComponent as LockIcon } from "../../assets/img/icon/lock.svg";
import { ReactComponent as EditIcon } from "../../assets/img/icon/edit.svg";
import { ReactComponent as VerifIcon } from "../../assets/img/icon/check.svg";
import { AxiosResponse } from "axios";

function ChannelPassword(props: { channel: IChannel; owner: User | null }) {
  const [isChangePassword, setIsChangePassword] = useState<boolean>(false);
  const [isModifyPassword, setIsModifyPassword] = useState<boolean>(false);
  const [isDeletePassword, setIsDeletePassword] = useState<boolean>(false);
  const [channelPassword, setChannelPassword] = useState<string>("");
  const [passwordVerifier, setPasswordVerifier] = useState<string>("");

  const { channel, owner } = props;
  const [newChannelStatus, setNewChannelStatus] = useState<string>(channel.status);
  const { user } = useContext(AuthContext);

  const onClickChangePassword = () => {
    setIsChangePassword(!isChangePassword);
    setIsModifyPassword(false);
    setIsDeletePassword(false);
  };

  const onClickEditPassword = () => {
    setChannelPassword("");
    setPasswordVerifier("");
    setIsModifyPassword(!isModifyPassword);
    setIsDeletePassword(false);
  };

  const onClickDeletePassword = () => {
    setPasswordVerifier("");
    setIsDeletePassword(!isDeletePassword);
    setIsModifyPassword(false);
  };

  const modifyPassword = async () => {
    await api
      .post("/channel/modifyPassword", {
        id: channel.id,
        current_password: channelPassword,
        new_password: passwordVerifier,
      })
      .then(() => {
        setIsChangePassword(false);
        setIsModifyPassword(false);
        setIsDeletePassword(false);
      })
      .catch(() => toast.error("Wrong password"));
    setChannelPassword("");
    setPasswordVerifier("");
  };

  const deletePassword = async () => {
    await api
      .post("/channel/deletePassword", {
        id: channel.id,
        password: passwordVerifier,
      })
      .then((res: AxiosResponse) => {
        setIsChangePassword(false);
        setIsModifyPassword(false);
        setIsDeletePassword(false);
        setNewChannelStatus(res.data.status);
      })
      .catch(() => toast.error("Wrong password"));
    setPasswordVerifier("");
  };

  return (
    <Fragment>
      {owner?.id === user?.id && newChannelStatus === "Protected" && (
        <button className="action" onClick={onClickChangePassword}>
          <LockIcon />
          <span>password</span>
        </button>
      )}
      {isChangePassword && (
        <Fragment>
          <button className="action" onClick={onClickEditPassword}>
            <EditIcon />
            <span>edit</span>
          </button>
          <button className="action" onClick={onClickDeletePassword}>
            <DeleteIcon />
            <span>delete</span>
          </button>
        </Fragment>
      )}
      {isModifyPassword && (
        <div className="channel__change__password">
          <input
            type="password"
            placeholder="Current Password..."
            value={channelPassword}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setChannelPassword(e.target.value)
            }
            disabled={!channel.name}
          />
          <input
            type="password"
            placeholder="New Password..."
            value={passwordVerifier}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPasswordVerifier(e.target.value)
            }
            disabled={!channel.name}
          />
          <button
            className="action"
            onClick={modifyPassword}
            disabled={
              !channelPassword || !passwordVerifier || !channel.name
            }
          >
            <VerifIcon />
          </button>
        </div>
      )}
      {isDeletePassword && (
        <div className="channel__delete__password">
          <input
            type="password"
            placeholder="Current Password..."
            value={passwordVerifier}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPasswordVerifier(e.target.value)
            }
            disabled={!channel.name}
          />
          <button
            className="action"
            disabled={!passwordVerifier || !channel.name}
            onClick={deletePassword}
          >
            <VerifIcon />
          </button>
        </div>
      )}
    </Fragment>
  );
}

export default ChannelPassword;