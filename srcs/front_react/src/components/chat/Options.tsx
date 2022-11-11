import { Fragment, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../../const/const";
import { AuthContext, User } from "../../contexts/AuthContext";
import { ChatDisplayContext } from "../../contexts/ChatDisplayContext";
import { IDatas } from "./Conversation";
import { IChannel, IDm } from "./types";

function DmUserProfile(props: {dm: IDm | null, targetRedirection: string}) {
  const { user } = useContext(AuthContext);
  const { dm, targetRedirection } = props;
  const {isRedirection} = useContext(ChatDisplayContext);
  const [ user2, setUser2 ] = useState<User>({} as User);

  const loadUser2 = async () => {
    await api
      .get("/user/id", { params: { id: targetRedirection}})
      .then( (res) => { 
        setUser2(res.data); })
      .catch(err => toast.error("HTTP error: " + err));
  }

  const findUser2 = () => {
    if (isRedirection)
    {
      const async_fct = async () => { 
        await loadUser2()
      };
      async_fct();
    }
    else
    {
      let searched_user = dm?.users?.find( (elem) => elem.id !== user?.id);
      if (searched_user)
        setUser2(searched_user);
      else
        toast.error("Couldn't fiend a conversation with that user...");
    }
  }

  useEffect( () => {
    if (!dm) return;
    findUser2();
  }, [isRedirection, dm])

  return (
  <div className="conversation__options__title">
    <img src={user2?.profile_picture} />
    <div className="text"> 
      <span>{user2?.username}</span>
      {isRedirection? <div className="date">Draft Message</div> : <div className="date">conv started at: {dm?.createdAt?.toLocaleString()}</div>}
    </div>
  </div>);
}

function DmOptions(props: {currentConvId: string, dm: IDm | null, targetRedirection: string}) {
  const {dm, targetRedirection} = props;

  return <Fragment>
      <DmUserProfile dm={dm} targetRedirection={targetRedirection}/>
    </Fragment>
}

function ChannelOptions(props: {currentConvId: string, channel: IDatas | null}) {
  return <Fragment></Fragment>
}

function Options(props: {currentConvId: string, isChannel: boolean, data: IDatas | IDm | null, targetRedirection: string}) {
  const {currentConvId, isChannel, data, targetRedirection} = props;

  return (
    <div className="conversation__options">
      {isChannel? <ChannelOptions currentConvId={currentConvId} channel={data as IDatas | null} /> : <DmOptions currentConvId={currentConvId} dm={data as IDm | null} targetRedirection={targetRedirection} />}
    </div>
  );
}

export default Options;
