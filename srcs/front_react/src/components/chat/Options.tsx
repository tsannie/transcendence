import { Fragment, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../../const/const";
import { AuthContext, User } from "../../contexts/AuthContext";
import { ChatDisplayContext } from "../../contexts/ChatDisplayContext";
import { IDm } from "./types";

function DmUserProfile(props: {dm: IDm}) {
  const { user } = useContext(AuthContext);
  const dm = props.dm;
  const user2 = dm?.users?.find( (elem) => elem.id !== user?.id)  

  console.log(dm);

  return <div className="conversation__options__title">
    <img src={user2?.profile_picture} />
    <div className="text"> 
      <span>{user2?.username}</span>
      <div className="date">conv started at: {dm?.createdAt?.toLocaleString()}</div>
    </div>
  </div>
}

function DmOptions() {
  const { currentConv } = useContext(ChatDisplayContext);
  const [dm, setDm] = useState<IDm>({} as IDm);

  const loadDm = async () => {
    await api
      .get("dm/datas", {params: {id: currentConv}})
      .then((res) => {
        setDm(res.data);
      })
      .catch((err) => {toast.error("HTTP error:" + err)});
  };

  useEffect(() => {
    const async_fct = async () => { await loadDm() };

    async_fct();
  }, []);

  return <Fragment>
      <DmUserProfile dm={dm}/>
    </Fragment>
}

function ChannelOptions() {
  return <Fragment></Fragment>
}

function Options() {
  const { isChannel } = useContext(ChatDisplayContext);

  return (
    <div className="conversation__options">
      {isChannel? <ChannelOptions /> : <DmOptions />}
    </div>
  );
}

export default Options;
