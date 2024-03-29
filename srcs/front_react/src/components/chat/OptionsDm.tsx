import { Fragment, useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ReactComponent as BallIcon } from "../../assets/img/icon/ball-reverse.svg";
import { api } from "../../const/const";
import { AuthContext, User } from "../../contexts/AuthContext";
import { ChatDisplayContext } from "../../contexts/ChatDisplayContext";
import { GameContext, GameContextType } from "../../contexts/GameContext";
import { GameMode } from "../game/const/const";
import { ICreateRoom } from "../game/types";
import { IDm } from "./types";

function DmUserProfile(props: { dm: IDm | null; targetRedirection: string }) {
  const { user } = useContext(AuthContext);
  const { dm, targetRedirection } = props;
  const { isRedirection } = useContext(ChatDisplayContext);
  const [user2, setUser2] = useState<User>({} as User);
  const { socket, setTimeQueue, friendsLog } = useContext(
    GameContext
  ) as GameContextType;
  const nav = useNavigate();

  const loadUser2 = () => {
    api
      .get("/user/id", { params: { id: targetRedirection } })
      .then((res) => {
        setUser2(res.data);
      })
      .catch((err) => toast.error(err.response.data.message));
  };

  const findUser2 = () => {
    if (isRedirection) loadUser2();
    else {
      if (!dm || !dm?.users) return;
      let searched_user = dm?.users?.find((elem) => elem.id !== user?.id);
      if (searched_user) setUser2(searched_user);
      else toast.error("Couldn't find a conversation with that user...");
    }
  };

  useEffect(() => {
    findUser2();
  }, [isRedirection, dm]);

  const handleInvite = (friend_id: string, mode: GameMode) => {
    if (socket) {
      const data: ICreateRoom = {
        mode: mode,
        invitation_user_id: friend_id,
      };
      socket.emit("createPrivateRoom", data);
      setTimeQueue(0);
      nav("/");
    }
  };

  return (
    <div className="conversation__options__title">
      <button className="clickable_profile">
        <Link
          style={{ textDecoration: "none" }}
          to={"/profile/" + user2?.username}
        >
          <img src={user2?.profile_picture} />
        </Link>
      </button>
      <div className="text">
        <span>{user2?.username}</span>
      </div>
      <div className="amical_match">
        <button
          title="Invite in classic mode"
          onClick={() => handleInvite(user2.id, GameMode.CLASSIC)}
          disabled={
            user?.friends?.find((elem) => elem.id === user2.id) &&
            friendsLog.find((elem) => elem.id === user2.id)
              ? false
              : true
          }
          id="classic"
        >
          <BallIcon />
        </button>
        <button
          title="Invite in trans mode"
          onClick={() => handleInvite(user2.id, GameMode.TRANS)}
          disabled={
            user?.friends?.find((elem) => elem.id === user2.id) &&
            friendsLog.find((elem) => elem.id === user2.id)
              ? false
              : true
          }
          id="trans"
        >
          <BallIcon />
        </button>
      </div>
    </div>
  );
}

function DmOptions(props: {
  currentConvId: string;
  dm: IDm | null;
  targetRedirection: string;
}) {
  const { dm, targetRedirection } = props;

  return (
    <Fragment>
      <DmUserProfile dm={dm} targetRedirection={targetRedirection} />
    </Fragment>
  );
}

export default DmOptions;
